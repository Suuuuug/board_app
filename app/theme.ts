"use client";

import { createTheme } from "@mui/material/styles";

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

export const postItColors = {
  bg: "#fff59d",
  border: "#e5d654",
  text: "#2c2a22",
  muted: "#4a4638",
  line: "rgba(44, 40, 28, 0.18)",
  done: "#2d6a4a",
  progress: "#1d5a8a",
  pending: "#9b3030",
};
