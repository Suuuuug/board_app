"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { PublicUser } from "@/lib/types";

type Props = {
  isOpen: boolean;
  users: PublicUser[];
  activeUserId: string | null;
  loggedIn: PublicUser | null;
  onSelectUser: (userId: string) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onViewAll: () => void;
  onToggle: () => void;
};

export default function Sidebar({
  isOpen,
  users,
  activeUserId,
  loggedIn,
  onSelectUser,
  onLoginClick,
  onLogout,
  onViewAll,
  onToggle,
}: Props) {
  if (!isOpen) {
    return (
      <Box
        component="aside"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: "24px 8px",
          boxShadow: "4px 0 12px rgba(0,0,0,0.08)",
          minHeight: 0,
          zIndex: 1,
        }}
      >
        <Button
          onClick={onToggle}
          color="inherit"
          sx={{ minWidth: 0, p: 0.5, fontSize: 16, lineHeight: 1 }}
        >
          {">>"}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="aside"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: "24px 16px",
        boxShadow: "4px 0 12px rgba(0,0,0,0.08)",
        minHeight: 0,
        zIndex: 1,
      }}
    >
      <Button
        onClick={onToggle}
        color="inherit"
        sx={{ minWidth: 0, p: 0.5, fontSize: 16, lineHeight: 1, alignSelf: "flex-end" }}
      >
        {"<<"}
      </Button>

      {loggedIn ? (
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            {loggedIn.name}
          </Typography>
          <Paper
            onClick={onLogout}
            sx={{ p: 1.5, cursor: "pointer", lineHeight: 1.4, "&:hover": { bgcolor: "action.hover" } }}
          >
            <Typography variant="body2">로그아웃</Typography>
          </Paper>
        </Stack>
      ) : (
        <Paper
          onClick={onLoginClick}
          sx={{ p: 1.5, cursor: "pointer", lineHeight: 1.4, "&:hover": { bgcolor: "action.hover" } }}
        >
          <Typography variant="body2">로그인</Typography>
        </Paper>
      )}

      <Box component="nav" aria-label="사용자 선택">
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          사용자 목록
        </Typography>
        <Stack spacing={1.25} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {users.map((u) => (
            <Paper
              key={u.id}
              component="li"
              onClick={() => onSelectUser(u.id)}
              sx={{
                p: 1.5,
                cursor: "pointer",
                lineHeight: 1.4,
                bgcolor: u.id === activeUserId ? "action.selected" : "background.paper",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: u.id === activeUserId ? 600 : 400 }}>
                {u.name}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Paper
        onClick={onViewAll}
        sx={{ p: 1.5, mt: "auto", cursor: "pointer", lineHeight: 1.4, "&:hover": { bgcolor: "action.hover" } }}
      >
        <Typography variant="body2">전체보기</Typography>
      </Paper>
    </Box>
  );
}
