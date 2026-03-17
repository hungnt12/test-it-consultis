"use client";

import { Button } from "antd";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
  disabled,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return (
    <div className={styles.wrapper}>
      {hasPrev && (
        <Button
          type="primary"
          disabled={disabled}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
      )}
      <span className={styles.info}>
        Page {page} of {totalPages}
      </span>
      {hasNext && (
        <Button
          type="primary"
          disabled={disabled}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      )}
    </div>
  );
}
