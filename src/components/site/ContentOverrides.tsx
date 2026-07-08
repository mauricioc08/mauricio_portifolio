"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { ContentDoc } from "@/types";

// Recebe os textos editáveis vindos do Firestore (server) e os injeta no i18n,
// sobrescrevendo as strings padrão. Se `overrides` for null, nada muda.
export function ContentOverrides({
  overrides,
  children,
}: {
  overrides: ContentDoc | null;
  children: React.ReactNode;
}) {
  const { setOverrides } = useI18n();

  useEffect(() => {
    setOverrides(overrides);
  }, [overrides, setOverrides]);

  return <>{children}</>;
}
