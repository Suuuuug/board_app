"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import type { PublicUser } from "@/lib/types";

type Props = {
  users: PublicUser[];
  activeUserId: string | null;
  loggedIn: PublicUser | null;
  onSelectUser: (userId: string) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onViewAll: () => void;
};

export default function Sidebar({
  users,
  activeUserId,
  loggedIn,
  onSelectUser,
  onLoginClick,
  onLogout,
  onViewAll,
}: Props) {
  return (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        gap: 3,
        p: "24px 16px",
        borderRight: 1,
        borderColor: "divider",
        minHeight: 0,
      }}
    >
      {loggedIn ? (
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            {loggedIn.name}
          </Typography>
          <Button variant="outlined" color="inherit" onClick={onLogout}>
            로그아웃
          </Button>
        </Stack>
      ) : (
        <Button variant="outlined" color="inherit" onClick={onLoginClick}>
          로그인
        </Button>
      )}

      <Box component="nav" aria-label="사용자 선택">
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          사용자 목록
        </Typography>
        <Stack spacing={1}>
          {users.map((u) => (
            <Button
              key={u.id}
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={() => onSelectUser(u.id)}
              sx={{
                justifyContent: "flex-start",
                py: 1.25,
                px: 1.5,
                fontSize: 14,
                ...(u.id === activeUserId
                  ? { bgcolor: "action.selected", borderColor: "text.secondary" }
                  : { color: "text.secondary" }),
              }}
            >
              {u.name}
            </Button>
          ))}
        </Stack>
      </Box>

      <Button variant="outlined" color="inherit" onClick={onViewAll} sx={{ mt: "auto" }}>
        전체보기
      </Button>
    </Box>
  );
}
