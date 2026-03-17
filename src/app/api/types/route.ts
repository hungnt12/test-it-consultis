import { NextResponse } from "next/server";
import { POKEAPI_BASE } from "@/lib/constants";
import type { PokeApiTypeListResponse, ApiTypesPayload } from "@/lib/types/pokemon";
import { getOrFetch } from "@/lib/cache";

const CACHE_KEY_TYPES_LIST = "pokeapi:types:list";

export async function GET() {
  try {
    const payload = await getOrFetch<ApiTypesPayload>(CACHE_KEY_TYPES_LIST, async () => {
      const res = await fetch(`${POKEAPI_BASE}/type`);
      if (!res.ok) throw new Error("Failed to fetch types");
      const data: PokeApiTypeListResponse = await res.json();
      return { results: data.results.map((r) => ({ name: r.name })) };
    });
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[api/types]", e);
    return NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
  }
}
