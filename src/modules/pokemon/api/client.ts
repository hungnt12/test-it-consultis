/**
 * Client gọi API nội bộ (/api/*). Không gọi PokeAPI trực tiếp từ browser.
 */
import type { ApiPokemonListPayload, ApiTypesPayload } from "@/lib/types/pokemon";
import { API_POKEMON_PATH, API_TYPES_PATH } from "@/lib/constants";

const BASE = "";

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, typeof window !== "undefined" ? window.location.origin : BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const pokemonApi = {
  list(params: { page?: number; limit?: number; types?: string[] }): Promise<ApiPokemonListPayload> {
    const search: Record<string, string> = {
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 24),
    };
    if (params.types?.length) {
      search.types = params.types.join(",");
    }
    return get<ApiPokemonListPayload>(API_POKEMON_PATH, search);
  },

  types(): Promise<ApiTypesPayload> {
    return get<ApiTypesPayload>(API_TYPES_PATH);
  },
};
