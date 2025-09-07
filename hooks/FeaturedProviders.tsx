import { providers } from "@/mockData";
import { useMemo } from "react";

export const featuredProviders = useMemo(
  () =>
    providers.filter((p) => {
      return p.featured;
    }),
  []
);
