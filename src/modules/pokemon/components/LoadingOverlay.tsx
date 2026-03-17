"use client";

import { Spin } from "antd";
import styles from "./LoadingOverlay.module.css";

export function LoadingOverlay() {
  return (
    <div className={styles.overlay} role="status" aria-label="Loading">
      <Spin size="large" />
    </div>
  );
}
