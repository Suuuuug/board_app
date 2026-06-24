"use client";

import {
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { appTheme } from "./theme";
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

  const [users, setUsers] = useState<PublicUser[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<PublicUser | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<{ todoId: string; completed: boolean } | null>(null);
  const [completeMessage, setCompleteMessage] = useState("");

  const postIts = useMemo(() => groupTodosIntoPostIts(todos), [todos]);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedIn");
    if (savedUser) {
      try {
        setLoggedIn(JSON.parse(savedUser) as PublicUser);
      } catch {}
    }
  }, []);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data: PublicUser[]) => {
        setUsers(data);
        if (data.length > 0) setActiveUserId(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (!activeUserId) return;
    fetch(`/api/todos?userId=${activeUserId}`)
      .then((r) => r.json())
      .then((data: Todo[]) => setTodos(data));
  }, [activeUserId]);

  useEffect(() => {
    fetch("/api/completions")
      .then((r) => r.json())
      .then((data: Completion[]) => setCompletions(data));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeUserId]);

  const handleLogin = (user: PublicUser) => {
    setLoggedIn(user);
    localStorage.setItem("loggedIn", JSON.stringify(user));
    setLoginOpen(false);
    setActiveUserId(user.id);
  };

  const handleLogout = () => {
    setLoggedIn(null);
    localStorage.removeItem("loggedIn");
    setLogoutOpen(false);
  };

  const handleToggleComplete = (todoId: string, completed: boolean) => {
    if (!loggedIn || loggedIn.id !== activeUserId) return;
    setCompleteMessage(completed ? "완료로 처리하시겠습니까?" : "완료를 취소하시겠습니까?");
    setCompleteTarget({ todoId, completed });
  };

  const handleConfirmToggle = async () => {
    if (!completeTarget) return;
    const { todoId, completed } = completeTarget;
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed, completedAt: completed ? new Date().toISOString() : null }),
    });
    setCompleteTarget(null);
    if (!res.ok) return;
    const updated: Todo = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)));
    fetch("/api/completions")
      .then((r) => r.json())
      .then((data: Completion[]) => setCompletions(data));
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
      fetch("/api/completions")
        .then((r) => r.json())
        .then((data: Completion[]) => setCompletions(data));
    }
    setDeleteTarget(null);
  };

  const canEdit = !!loggedIn && loggedIn.id === activeUserId;

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: sidebarOpen
            ? { xs: "160px 1fr", md: "160px 1fr 200px" }
            : { xs: "40px 1fr", md: "40px 1fr 200px" },
          height: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Sidebar
          isOpen={sidebarOpen}
          users={users}
          activeUserId={activeUserId}
          loggedIn={loggedIn}
          onSelectUser={setActiveUserId}
          onLoginClick={() => setLoginOpen(true)}
          onLogout={() => setLogoutOpen(true)}
          onViewAll={() => router.push("/all")}
          onToggle={() => setSidebarOpen((v) => !v)}
        />

        <Box
          component="main"
          sx={{ p: 3, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5 }}>
            To do list
          </Typography>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              p: "16px 24px 24px",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
              ↓ 스크롤하여 이전 기록 보기
            </Typography>
            <Box
              ref={scrollRef}
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                scrollSnapType: "y mandatory",
                p: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
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

        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 1.5,
            p: "24px 16px",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
            overflowY: "auto",
            minHeight: 0,
            zIndex: 1,
          }}
        >
          <CompletionLog completions={completions} />
        </Box>
      </Box>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
      <ConfirmDialog
        open={!!completeTarget}
        message={completeMessage}
        onConfirm={handleConfirmToggle}
        onCancel={() => setCompleteTarget(null)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        message="이 할 일을 정말 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={logoutOpen}
        message="로그아웃하시겠습니까?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </ThemeProvider>
  );
}
