"use client";

import { useEffect } from "react";

export function UrlCleaner() {
  useEffect(() => {
    // Determine if we have the 'access' parameter
    const url = new URL(window.location.href);
    if (url.searchParams.has("access")) {
      // Remove it
      url.searchParams.delete("access");
      // Replace history state without reloading
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return null;
}
