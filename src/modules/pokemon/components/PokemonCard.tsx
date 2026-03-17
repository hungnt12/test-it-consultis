"use client";

import type { PokemonListItem } from "@/lib/types/pokemon";
import styles from "./PokemonCard.module.css";

export interface PokemonCardProps {
  item: PokemonListItem;
}

export function PokemonCard({ item }: PokemonCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{item.name}</h3>
      <div className={styles.imageWrap}>
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </div>
      <p className={styles.order}>#{item.id}</p>
    </article>
  );
}
