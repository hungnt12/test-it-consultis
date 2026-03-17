"use client";

import type { PokemonListItem } from "@/lib/types/pokemon";
import { PokemonCard } from "./PokemonCard";
import styles from "./PokemonList.module.css";

export interface PokemonListProps {
  items: PokemonListItem[];
}

export function PokemonList({ items }: PokemonListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={`${item.id}-${item.name}`}>
          <PokemonCard item={item} />
        </li>
      ))}
    </ul>
  );
}
