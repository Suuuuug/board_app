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

export default function AllPage() {
  const today = new Date().toISOString().split("T")[0];
  const users = db.users.all().map(({ pin: _pin, ...u }) => u);

  const usersWithTodos = users.map((user) => {
    const allTodos = db.todos.byUser(user.id);
    const todayTodos = allTodos.filter(
      (t) =>
        !t.completed ||
        (t.completedAt != null && t.completedAt.startsWith(today))
    );
    return { user, todos: todayTodos };
  });

  const displayDate = today.replace(/-/g, ".");

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          전체 포스트잇 — {displayDate}
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

      <Grid container spacing={3}>
        {usersWithTodos.map(({ user, todos }) => (
          <Grid key={user.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: postItColors.bg,
                color: postItColors.text,
                border: `1px solid ${postItColors.border}`,
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: postItColors.muted }}>
                  {displayDate}
                </Typography>
              </Box>

              {todos.length === 0 ? (
                <Typography variant="body2" sx={{ color: postItColors.muted }}>
                  오늘 할 일 없음
                </Typography>
              ) : (
                todos.map((todo) => {
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
        ))}
      </Grid>
    </Box>
  );
}
