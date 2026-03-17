"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback, useEffect, useState } from "react";
import { usePokemonQuery } from "@/modules/pokemon/hooks/usePokemonQuery";
import { LoadingOverlay } from "@/modules/pokemon/components/LoadingOverlay";
import { TypeFilters } from "@/modules/pokemon/components/TypeFilters";
import { PokemonList } from "@/modules/pokemon/components/PokemonList";
import { Pagination } from "@/modules/pokemon/components/Pagination";
import {
  QUERY_PARAM_PAGE,
  QUERY_PARAM_TYPES,
  LIMIT_PER_PAGE,
} from "@/lib/constants";
import styles from "./page.module.css";

function useQueryState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(1, parseInt(searchParams.get(QUERY_PARAM_PAGE) ?? "1", 10));
  const types = useMemo(() => {
    const t = searchParams.get(QUERY_PARAM_TYPES);
    if (!t?.trim()) return [];
    return t.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  }, [searchParams]);

  const setPage = useCallback(
    (nextPage: number) => {
      const next = new URLSearchParams(searchParams);
      next.set(QUERY_PARAM_PAGE, String(nextPage));
      router.replace(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const toggleType = useCallback(
    (name: string) => {
      const next = new URLSearchParams(searchParams);
      const nextTypes = types.includes(name)
        ? types.filter((x) => x !== name)
        : [...types, name];
      next.set(QUERY_PARAM_PAGE, "1");
      if (nextTypes.length) next.set(QUERY_PARAM_TYPES, nextTypes.join(","));
      else next.delete(QUERY_PARAM_TYPES);
      router.replace(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams, types]
  );

  return { page, types, setPage, toggleType };
}

export function PokemonPageClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { page, types, setPage, toggleType } = useQueryState();
  const { listData, typesData, loading, error } = usePokemonQuery({ page, types });

  const total = listData?.count ?? 0;
  const results = listData?.results ?? [];
  const typeList = typesData?.results ?? [];

  if (!mounted) {
    return <LoadingOverlay />;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Welcome to Pokemon world</h1>
      <p className={styles.total}>Total: {total} items</p>
      <TypeFilters
        types={typeList}
        selected={types}
        onToggle={toggleType}
        disabled={loading}
      />
      <main className={styles.main}>
        {loading && <LoadingOverlay />}
        {!loading && error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
        {!loading && !error && results.length > 0 && (
          <PokemonList items={results} />
        )}
        {!loading && !error && results.length === 0 && (
          <p className={styles.empty}>No results.</p>
        )}
      </main>
      {!loading && total > 0 && (
        <Pagination
          page={page}
          total={total}
          pageSize={LIMIT_PER_PAGE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
