export const dynamic = "force-dynamic";

import { Box, Grid, Paper, Typography } from "@mui/material";
import { db } from "@/lib/json-db";
import type { Todo } from "@/lib/types";
import { postItColors } from "@/lib/colors";

function getTodoStatus(todo: Todo): string {
  if (todo.completed) return "완료";
  const created = new Date(todo.createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  created.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - created.getTime()) / 86400000);
  if (diff === 0) return "진행";
  return `${diff + 1}일째`;
}

function statusColor(status: string): string {
  if (status === "완료") return postItColors.done;
  if (status === "진행") return postItColors.progress;
  return postItColors.pending;
}

type UserWithTodos = { user: { id: string; name: string }; todos: Todo[] };

function DateSection({
  date,
  label,
  usersWithTodos,
}: {
  date: string;
  label: string;
  usersWithTodos: UserWithTodos[];
}) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: "#555" }}>
        {label}
      </Typography>
      <Grid container spacing={3}>
        {usersWithTodos.map(({ user, todos }) => {
          const filtered =
            date === "today-placeholder"
              ? todos
              : todos.filter(
                  (t) => t.completed && t.completedAt != null && t.completedAt.startsWith(date)
                );
          return (
            <Grid key={user.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2.5,
                  bgcolor: postItColors.bg,
                  color: postItColors.text,
                  borderRadius: 0,
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: postItColors.muted }}>
                    {label}
                  </Typography>
                </Box>

                {filtered.length === 0 ? (
                  <Typography variant="body2" sx={{ color: postItColors.muted }}>
                    없음
                  </Typography>
                ) : (
                  filtered.map((todo) => {
                    const status = getTodoStatus(todo);
                    return (
                      <Box
                        key={todo.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          borderBottom: `1px solid ${postItColors.line}`,
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={
                            todo.completed
                              ? { color: "#8a8468", textDecoration: "line-through", flex: 1 }
                              : { flex: 1 }
                          }
                        >
                          {todo.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: statusColor(status), flexShrink: 0, fontSize: 11 }}
                        >
                          {status}
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default async function AllPage() {
  const today = new Date().toISOString().split("T")[0];
  const users = (await db.users.all()).map(({ pin: _pin, ...u }) => u);

  const usersWithAllTodos: UserWithTodos[] = await Promise.all(
    users.map(async (user) => {
      const allTodos = await db.todos.byUser(user.id);
      return { user, todos: allTodos };
    })
  );

  const todayUsers: UserWithTodos[] = usersWithAllTodos.map(({ user, todos }) => ({
    user,
    todos: todos.filter(
      (t) => !t.completed || (t.completedAt != null && t.completedAt.startsWith(today))
    ),
  }));

  const pastDatesSet = new Set<string>();
  for (const { todos } of usersWithAllTodos) {
    for (const todo of todos) {
      if (todo.completed && todo.completedAt) {
        const date = todo.completedAt.split("T")[0];
        if (date !== today) pastDatesSet.add(date);
      }
    }
  }
  const pastDates = [...pastDatesSet].sort((a, b) => b.localeCompare(a));

  const todayLabel = `${today.replace(/-/g, ".")} (오늘)`;

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#e8e8e8" }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          전체 포스트잇
        </Typography>
        <Typography
          component="a"
          href="/"
          variant="body2"
          sx={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }}
        >
          ← 돌아가기
        </Typography>
      </Box>

      <DateSection
        date="today-placeholder"
        label={todayLabel}
        usersWithTodos={todayUsers}
      />

      {pastDates.map((date) => (
        <DateSection
          key={date}
          date={date}
          label={date.replace(/-/g, ".")}
          usersWithTodos={usersWithAllTodos}
        />
      ))}
    </Box>
  );
}
