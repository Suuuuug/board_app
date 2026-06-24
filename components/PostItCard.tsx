"use client";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Button,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Todo } from "@/lib/types";
import { postItColors } from "@/lib/colors";

type Props = {
  date: string;
  todos: Todo[];
  canEdit: boolean;
  onToggleComplete: (todoId: string, completed: boolean) => void;
  onDeleteTodo: (todoId: string) => void;
  onAddTodo: (text: string) => void;
};

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

function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}.${month}.${day}`;
}

export default function PostItCard({
  date,
  todos,
  canEdit,
  onToggleComplete,
  onDeleteTodo,
  onAddTodo,
}: Props) {
  const [inputText, setInputText] = useState("");

  const handleAdd = () => {
    if (!inputText.trim()) return;
    onAddTodo(inputText.trim());
    setInputText("");
  };

  return (
    <Paper
      sx={{
        minHeight: "100%",
        scrollSnapAlign: "start",
        p: 2.5,
        bgcolor: postItColors.bg,
        color: postItColors.text,
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="body2" align="right" sx={{ mb: 2, color: postItColors.muted }}>
        {formatDisplayDate(date)}
      </Typography>

      <List dense disablePadding sx={{ flex: 1, overflow: "auto", mb: 2 }}>
        {todos.map((todo) => {
          const status = getTodoStatus(todo);
          return (
            <ListItem
              key={todo.id}
              disableGutters
              sx={{
                py: 1.25,
                borderBottom: `1px solid ${postItColors.line}`,
                gap: 1,
              }}
            >
              <Checkbox
                size="small"
                checked={todo.completed}
                disabled={!canEdit}
                onChange={() => onToggleComplete(todo.id, !todo.completed)}
                icon={<CheckBoxOutlineBlankIcon sx={{ color: postItColors.text }} />}
                checkedIcon={<CheckBoxIcon sx={{ color: postItColors.text }} />}
                sx={{ p: 0, cursor: canEdit ? "pointer" : "default" }}
              />
              <ListItemText
                primary={todo.text}
                slotProps={{
                  primary: {
                    variant: "body2",
                    sx: todo.completed
                      ? { color: "#8a8468", textDecoration: "line-through" }
                      : undefined,
                  },
                }}
                sx={{ flex: 1, m: 0 }}
              />
              <Chip
                label={status}
                size="small"
                variant="outlined"
                onClick={canEdit ? () => onDeleteTodo(todo.id) : undefined}
                sx={{
                  height: 22,
                  fontSize: 11,
                  bgcolor: "rgba(255,255,255,0.45)",
                  borderColor: postItColors.line,
                  color: statusColor(status),
                  cursor: canEdit ? "pointer" : "default",
                }}
                title={canEdit ? "클릭하여 삭제" : undefined}
              />
            </ListItem>
          );
        })}
      </List>

      {canEdit && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ pt: 1.5, borderTop: `1px solid ${postItColors.line}` }}
        >
          <TextField
            placeholder="새 할 일 입력..."
            variant="standard"
            size="small"
            fullWidth
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            slotProps={{
              input: {
                sx: {
                  color: postItColors.text,
                  "&::placeholder": { color: "#9a9268", opacity: 1 },
                  "&:before": { borderBottomColor: "#b8a86a" },
                },
              },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleAdd}
            sx={{
              flexShrink: 0,
              bgcolor: "rgba(255,255,255,0.5)",
              borderColor: "#c4b45a",
              color: postItColors.text,
            }}
          >
            add
          </Button>
        </Stack>
      )}

    </Paper>
  );
}
