"use client";

import { createTheme } from "@mui/material/styles";
export { postItColors } from "@/lib/colors";

export const appTheme = createTheme({
  palette: {
    background: { default: "#e8e8e8", paper: "#fff" },
    divider: "#ccc",
    text: { primary: "#111", secondary: "#666" },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
