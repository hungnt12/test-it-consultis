import { NextResponse } from "next/server";
import type { PokeApiTypeListResponse, ApiTypesPayload } from "@/lib/types/pokemon";
import { getOrFetch } from "@/lib/cache";
import { pokedexClient } from "@/lib/pokedexClient";

const CACHE_KEY_TYPES_LIST = "pokeapi:types:list";

async function fetchTypes(): Promise<ApiTypesPayload> {
  const data = await pokedexClient.getTypeList();
  const results =
    (data as PokeApiTypeListResponse | null)?.results?.map((r) => ({ name: r.name })) ??
    [];
  return { results };
}

export async function GET() {
  try {
    const payload = await getOrFetch<ApiTypesPayload>(CACHE_KEY_TYPES_LIST, fetchTypes);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[api/types]", e);
    return NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
  }
}
