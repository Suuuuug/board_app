"use client";

import { createTheme } from "@mui/material/styles";
export { postItColors } from "@/lib/colors";

export function createAppTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            background: { default: "#000", paper: "#111" },
            divider: "#333",
            text: { primary: "#fff", secondary: "#888" },
          }
        : {
            background: { default: "#e8e8e8", paper: "#fff" },
            divider: "#ccc",
            text: { primary: "#111", secondary: "#666" },
          }),
    },
    typography: {
      fontFamily: "var(--font-geist-sans), sans-serif",
    },
    shape: {
      borderRadius: 0,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 20,
          },
        },
      },
    },
  });
}

