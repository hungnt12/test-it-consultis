import { NextRequest, NextResponse } from "next/server";
import {
  POKEAPI_BASE,
  LIMIT_PER_PAGE,
  POKEAPI_SHOWDOWN_SPRITE_BASE,
} from "@/lib/constants";
import type {
  PokeApiListResponse,
  PokeApiTypeDetailResponse,
  PokemonListItem,
  ApiPokemonListPayload,
} from "@/lib/types/pokemon";
import { getOrFetch } from "@/lib/cache";

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
}

async function safeFetchJson<T>(url: string): Promise<T | null> {
  const startedAt = Date.now();
  console.log("[api/pokemon] -> external request", { url });
  try {
    const res = await fetch(url);
    const duration = Date.now() - startedAt;
    if (!res.ok) {
      console.warn("[api/pokemon] <- external non-ok", {
        url,
        status: res.status,
        durationMs: duration,
      });
      return null;
    }
    const json = (await res.json()) as T;
    console.log("[api/pokemon] <- external success", {
      url,
      durationMs: duration,
    });
    return json;
  } catch (error) {
    const duration = Date.now() - startedAt;
    console.error("[api/pokemon] <- external error", {
      url,
      durationMs: duration,
      error,
    });
    return null;
  }
}

function buildPokemonListItems(
  items: { name: string; url: string }[]
): PokemonListItem[] {
  return items.map((item) => {
    const id = extractIdFromUrl(item.url);
    const imageUrl =
      id > 0
        ? `${POKEAPI_SHOWDOWN_SPRITE_BASE}/${id}.gif`
        : null;
    return {
      id,
      name: item.name,
      imageUrl,
    };
  });
}

/** Lấy list không filter: PokeAPI /pokemon?limit&offset rồi fetch detail từng item */
async function fetchListNoFilter(
  limit: number,
  offset: number
): Promise<ApiPokemonListPayload> {
  const data = await safeFetchJson<PokeApiListResponse>(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!data) {
    return { count: 0, results: [] };
  }
  const results = buildPokemonListItems(data.results);
  return { count: data.count, results };
}

/** Lấy list theo types: gọi /type/{name} cho từng type, INTERSECT (chung tất cả type), phân trang */
async function fetchListByTypes(
  typeNames: string[],
  page: number,
  limit: number
): Promise<ApiPokemonListPayload> {
  if (typeNames.length === 0) {
    return fetchListNoFilter(limit, (page - 1) * limit);
  }

  const typeResponses = await Promise.all(
    typeNames.map((name) =>
      getOrFetch<PokeApiTypeDetailResponse | null>(
        `pokeapi:type:${name}`,
        async () => safeFetchJson<PokeApiTypeDetailResponse>(`${POKEAPI_BASE}/type/${name}`)
      )
    )
  );

  // Xây map name -> { url, count } để lấy giao (intersection) giữa các type
  const counts = new Map<string, { url: string; count: number }>();
  for (const tr of typeResponses) {
    if (!tr) continue;
    for (const entry of tr.pokemon ?? []) {
      const name = entry.pokemon?.name;
      const url = entry.pokemon?.url;
      if (!name || !url) continue;
      const existing = counts.get(name);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(name, { url, count: 1 });
      }
    }
  }

  const intersected: { name: string; url: string }[] = [];
  for (const [name, info] of counts.entries()) {
    if (info.count === typeNames.length) {
      intersected.push({ name, url: info.url });
    }
  }

  const total = intersected.length;
  const start = (page - 1) * limit;
  const slice = intersected.slice(start, start + limit);
  const results = buildPokemonListItems(slice);

  return { count: total, results };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typesParam = searchParams.get("types");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      LIMIT_PER_PAGE,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(LIMIT_PER_PAGE), 10))
    );

    console.log("[api/pokemon] incoming request", {
      url: request.url,
      page,
      limit,
      typesParam,
    });

    if (typesParam && typesParam.trim()) {
      const typeNames = typesParam
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      console.log("[api/pokemon] filter by types", { typeNames });
      const payload = await fetchListByTypes(typeNames, page, limit);
      console.log("[api/pokemon] response for types", {
        total: payload.count,
        page,
        pageSize: limit,
      });
      return NextResponse.json(payload);
    }

    const offset = (page - 1) * limit;
    const payload = await fetchListNoFilter(limit, offset);
    console.log("[api/pokemon] response no filter", {
      total: payload.count,
      page,
      pageSize: limit,
      offset,
    });
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[api/pokemon]", e);
    return NextResponse.json(
      { error: "Failed to fetch pokemon list" },
      { status: 500 }
    );
  }
}
