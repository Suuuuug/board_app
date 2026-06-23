"use client";

import {
  Box,
  Button,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createAppTheme } from "./theme";
import Sidebar from "@/components/Sidebar";
import PostItCard from "@/components/PostItCard";
import CompletionLog from "@/components/CompletionLog";
import LoginDialog from "@/components/LoginDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Completion, PostItRecord, PublicUser, Todo } from "@/lib/types";

function groupTodosIntoPostIts(todos: Todo[]): PostItRecord[] {
  const today = new Date().toISOString().split("T")[0];
  const groups = new Map<string, Todo[]>();
  groups.set(today, []);

  for (const todo of todos) {
    if (!todo.completed) {
      groups.get(today)!.push(todo);
    } else if (todo.completedAt) {
      const date = todo.completedAt.split("T")[0];
      if (date === today) {
        groups.get(today)!.push(todo);
      } else {
        if (!groups.has(date)) groups.set(date, []);
        groups.get(date)!.push(todo);
      }
    }
  }

  return [...groups.entries()]
    .map(([date, todoList]) => ({ date, todos: todoList, isToday: date === today }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function TodoListView() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [dark, setDark] = useState(true);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<PublicUser | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const theme = useMemo(() => createAppTheme(dark ? "dark" : "light"), [dark]);
  const postIts = useMemo(() => groupTodosIntoPostIts(todos), [todos]);

  // Load theme and logged-in user from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setDark(false);

    const savedUser = localStorage.getItem("loggedIn");
    if (savedUser) {
      try {
        setLoggedIn(JSON.parse(savedUser) as PublicUser);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Fetch users on mount
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data: PublicUser[]) => {
        setUsers(data);
        if (data.length > 0) setActiveUserId(data[0].id);
      });
  }, []);

  // Fetch todos when active user changes
  useEffect(() => {
    if (!activeUserId) return;
    fetch(`/api/todos?userId=${activeUserId}`)
      .then((r) => r.json())
      .then((data: Todo[]) => setTodos(data));
  }, [activeUserId]);

  // Fetch completions on mount
  useEffect(() => {
    fetch("/api/completions")
      .then((r) => r.json())
      .then((data: Completion[]) => setCompletions(data));
  }, []);

  // Scroll to top when user changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeUserId]);

  const handleSelectUser = (userId: string) => setActiveUserId(userId);

  const handleLogin = (user: PublicUser) => {
    setLoggedIn(user);
    localStorage.setItem("loggedIn", JSON.stringify(user));
    setLoginOpen(false);
    // Switch to logged-in user's post-it
    setActiveUserId(user.id);
  };

  const handleLogout = () => {
    setLoggedIn(null);
    localStorage.removeItem("loggedIn");
  };

  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    if (!loggedIn || loggedIn.id !== activeUserId) return;
    const completedAt = completed ? new Date().toISOString() : null;
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed, completedAt }),
    });
    if (!res.ok) return;
    const updated: Todo = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)));

    if (completed) {
      // Refresh completions
      fetch("/api/completions")
        .then((r) => r.json())
        .then((data: Completion[]) => setCompletions(data));
    }
  };

  const handleAddTodo = async (text: string) => {
    if (!loggedIn || loggedIn.id !== activeUserId) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeUserId, text }),
    });
    if (!res.ok) return;
    const created: Todo = await res.json();
    setTodos((prev) => [...prev, created]);
  };

  const handleDeleteTodo = (todoId: string) => {
    if (!loggedIn || loggedIn.id !== activeUserId) return;
    setDeleteTarget(todoId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/todos/${deleteTarget}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== deleteTarget));
    }
    setDeleteTarget(null);
  };

  const canEdit = !!loggedIn && loggedIn.id === activeUserId;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "160px 1fr 200px" },
          height: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        {/* Left sidebar */}
        <Sidebar
          users={users}
          activeUserId={activeUserId}
          loggedIn={loggedIn}
          onSelectUser={handleSelectUser}
          onLoginClick={() => setLoginOpen(true)}
          onLogout={handleLogout}
          onViewAll={() => router.push("/all")}
        />

        {/* Main area */}
        <Box
          component="main"
          sx={{ p: 3, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}
        >
          <Stack
            direction="row"
            sx={{ mb: 2.5, gap: 1.5, alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              To do list
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => setDark((v) => !v)}
              sx={{ fontSize: 12, py: 0.75, px: 1.5, borderRadius: 0 }}
            >
              {dark ? "라이트 모드" : "다크 모드"}
            </Button>
          </Stack>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              p: "16px 24px 24px",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
              ↓ 스크롤하여 이전 기록 보기
            </Typography>
            <Box
              ref={scrollRef}
              sx={{ flex: 1, minHeight: 0, overflowY: "auto", scrollSnapType: "y mandatory" }}
            >
              {postIts.map((record: PostItRecord) => (
                <PostItCard
                  key={record.date}
                  date={record.date}
                  todos={record.todos}
                  canEdit={canEdit && record.isToday}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTodo={handleDeleteTodo}
                  onAddTodo={handleAddTodo}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right sidebar */}
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 1.5,
            p: "24px 16px",
            borderLeft: 1,
            borderColor: "divider",
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <CompletionLog completions={completions} />
        </Box>
      </Box>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
      <ConfirmDialog
        open={!!deleteTarget}
        message="이 할 일을 정말 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </ThemeProvider>
  );
}
