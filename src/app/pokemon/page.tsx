import { Suspense } from "react";
import { PokemonPageClient } from "./PokemonPageClient";
import { LoadingOverlay } from "@/modules/pokemon/components/LoadingOverlay";

export default function PokemonPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <PokemonPageClient />
    </Suspense>
  );
}
