"use client";

import { Paper, Stack, Typography } from "@mui/material";
import type { Completion } from "@/lib/types";

type Props = {
  completions: Completion[];
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const hhmm = d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });

  if (sameDay(d, today)) return hhmm;
  if (sameDay(d, yesterday)) return `어제 ${hhmm}`;
  return `${d.getMonth() + 1}/${d.getDate()} ${hhmm}`;
}

export default function CompletionLog({ completions }: Props) {
  return (
    <>
      <Typography variant="caption" color="text.secondary">
        완료 기록
      </Typography>
      <Stack spacing={1.25} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {completions.map((entry) => (
          <Paper
            key={entry.id}
            component="li"
            sx={{ p: 1.5, lineHeight: 1.4 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {entry.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {entry.task}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
              {formatTime(entry.completedAt)}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </>
  );
}
