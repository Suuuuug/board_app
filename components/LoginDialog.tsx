"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { PublicUser } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (user: PublicUser) => void;
};

export default function LoginDialog({ open, onClose, onLogin }: Props) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !pin.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), pin: pin.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "로그인 실패");
        return;
      }
      const user: PublicUser = await res.json();
      onLogin(user);
      setName("");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>로그인</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
        <TextField
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="PIN"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          fullWidth
          size="small"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained">
          로그인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
