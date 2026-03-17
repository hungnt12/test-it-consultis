"use client";

import { useState, useEffect, useCallback } from "react";
import { pokemonApi } from "../api/client";
import type { ApiPokemonListPayload, ApiTypesPayload } from "@/lib/types/pokemon";
import { LIMIT_PER_PAGE, FILTER_DEBOUNCE_MS } from "@/lib/constants";

export interface UsePokemonQueryParams {
  page: number;
  types: string[];
}

export function usePokemonQuery(params: UsePokemonQueryParams) {
  const [listData, setListData] = useState<ApiPokemonListPayload | null>(null);
  const [typesData, setTypesData] = useState<ApiTypesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async (page: number, types: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await pokemonApi.list({
        page,
        limit: LIMIT_PER_PAGE,
        types: types.length ? types : undefined,
      });
      setListData(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setListData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = params.types.length ? FILTER_DEBOUNCE_MS : 0;
    const t = setTimeout(() => {
      fetchList(params.page, params.types);
    }, delay);
    return () => clearTimeout(t);
  }, [params.page, params.types.join(","), fetchList]);

  useEffect(() => {
    pokemonApi.types().then(setTypesData).catch(() => setTypesData({ results: [] }));
  }, []);

  return {
    listData,
    typesData,
    loading,
    error,
    refetch: () => fetchList(params.page, params.types),
  };
}
