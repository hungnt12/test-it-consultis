"use client";

import { Tag } from "antd";
import styles from "./TypeFilters.module.css";

export interface TypeFiltersProps {
  types: { name: string }[];
  selected: string[];
  onToggle: (name: string) => void;
  disabled?: boolean;
}

export function TypeFilters({
  types,
  selected,
  onToggle,
  disabled,
}: TypeFiltersProps) {
  return (
    <div className={styles.wrapper}>
      {types.map((t) => {
        const isSelected = selected.includes(t.name);
        return (
          <Tag
            key={t.name}
            color={isSelected ? "blue" : "default"}
            className={styles.tag}
            onClick={() => !disabled && onToggle(t.name)}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          >
            {t.name}
          </Tag>
        );
      })}
    </div>
  );
}
