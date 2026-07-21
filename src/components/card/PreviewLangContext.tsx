"use client";

import { createContext, useContext } from "react";
import type { LangCode } from "@/types/card";

/**
 * Lets the in-card {@link LanguageSwitcher} operate inside the dashboard live
 * preview. On the public card the switcher drives the `?lang=` URL; the editor
 * preview can't navigate, so when this context is present the switcher reads the
 * current language and reports changes through it instead (wired to the editor's
 * `previewLang` state). Absent (the default) means "public card, use the URL".
 */
export interface PreviewLangControl {
  current: LangCode;
  onChange: (lang: LangCode) => void;
}

const PreviewLangContext = createContext<PreviewLangControl | null>(null);

export const PreviewLangProvider = PreviewLangContext.Provider;

/** Returns the preview language control, or null on the public card. */
export function usePreviewLang(): PreviewLangControl | null {
  return useContext(PreviewLangContext);
}
