"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
}
