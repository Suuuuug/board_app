"use client";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { createAppTheme, postItColors } from "./theme";

const USERS = ["사용자1", "사용자2", "사용자3", "사용자4"];

type Status = "완료" | "진행" | "n일째";

type Task = {
  id: number;
  text: string;
  checked: boolean;
  status: Status;
};

type PostItRecord = {
  date: string;
  tasks: Task[];
  editable?: boolean;
};

type CompletionLog = {
  id: number;
  user: string;
  task: string;
  time: string;
};

const STATUS_CHIP: Record<
  Status,
  { label: Status; sx: { color: string } }
> = {
  완료: { label: "완료", sx: { color: postItColors.done } },
  진행: { label: "진행", sx: { color: postItColors.progress } },
  "n일째": { label: "n일째", sx: { color: postItColors.pending } },
};

const RECORDS: PostItRecord[][] = [
  [
    {
      date: "2024.05.18",
      tasks: [
        { id: 1, text: "업무1", checked: true, status: "완료" },
        { id: 2, text: "업무2", checked: true, status: "완료" },
      ],
    },
    {
      date: "2024.05.20",
      tasks: [
        { id: 1, text: "업무3", checked: true, status: "완료" },
        { id: 2, text: "업무4", checked: false, status: "n일째" },
      ],
    },
    {
      date: "2024.05.22",
      editable: true,
      tasks: [
        { id: 1, text: "업무5", checked: true, status: "완료" },
        { id: 2, text: "업무6", checked: false, status: "진행" },
        { id: 3, text: "업무7", checked: false, status: "n일째" },
      ],
    },
  ],
  [
    {
      date: "2024.05.19",
      tasks: [{ id: 1, text: "업무8", checked: true, status: "완료" }],
    },
    {
      date: "2024.05.22",
      editable: true,
      tasks: [
        { id: 1, text: "업무9", checked: false, status: "진행" },
        { id: 2, text: "업무10", checked: false, status: "n일째" },
      ],
    },
  ],
  [
    {
      date: "2024.05.21",
      tasks: [{ id: 1, text: "업무11", checked: true, status: "완료" }],
    },
    {
      date: "2024.05.22",
      editable: true,
      tasks: [{ id: 1, text: "업무12", checked: false, status: "진행" }],
    },
  ],
  [
    {
      date: "2024.05.22",
      editable: true,
      tasks: [
        { id: 1, text: "업무13", checked: true, status: "완료" },
        { id: 2, text: "업무14", checked: false, status: "진행" },
      ],
    },
  ],
];

const COMPLETION_LOG: CompletionLog[] = [
  { id: 1, user: "사용자2", task: "업무1", time: "10:32" },
  { id: 2, user: "사용자1", task: "업무2", time: "09:15" },
  { id: 3, user: "사용자3", task: "업무3", time: "어제 18:40" },
  { id: 4, user: "사용자4", task: "업무4", time: "어제 14:02" },
  { id: 5, user: "사용자2", task: "업무5", time: "5/18 20:11" },
];

function PostItCard({ record }: { record: PostItRecord }) {
  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: "100%",
        scrollSnapAlign: "start",
        p: 2.5,
        bgcolor: postItColors.bg,
        color: postItColors.text,
        border: `1px solid ${postItColors.border}`,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="body2"
        align="right"
        sx={{ mb: 2, color: postItColors.muted }}
      >
        {record.date}
      </Typography>

      <List dense disablePadding sx={{ flex: 1, overflow: "auto", mb: 2 }}>
        {record.tasks.map((task) => (
          <ListItem
            key={task.id}
            disableGutters
            sx={{
              py: 1.25,
              borderBottom: `1px solid ${postItColors.line}`,
              gap: 1,
            }}
          >
            <Checkbox
              size="small"
              checked={task.checked}
              readOnly
              icon={<CheckBoxOutlineBlankIcon sx={{ color: postItColors.text }} />}
              checkedIcon={<CheckBoxIcon sx={{ color: postItColors.text }} />}
              sx={{ p: 0 }}
            />
            <ListItemText
              primary={task.text}
              slotProps={{
                primary: {
                  variant: "body2",
                  sx: task.checked
                    ? {
                        color: "#8a8468",
                        textDecoration: "line-through",
                      }
                    : undefined,
                },
              }}
              sx={{ flex: 1, m: 0 }}
            />
            <Chip
              label={STATUS_CHIP[task.status].label}
              size="small"
              variant="outlined"
              sx={{
                height: 22,
                fontSize: 11,
                bgcolor: "rgba(255,255,255,0.45)",
                borderColor: postItColors.line,
                ...STATUS_CHIP[task.status].sx,
              }}
            />
          </ListItem>
        ))}
      </List>

      {record.editable && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ pt: 1.5, borderTop: `1px solid ${postItColors.line}` }}
        >
          <TextField
            placeholder="Enter..."
            variant="standard"
            size="small"
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
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

export default function TodoListView() {
  const [activeUser, setActiveUser] = useState(0);
  const [dark, setDark] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const theme = useMemo(
    () => createAppTheme(dark ? "dark" : "light"),
    [dark],
  );

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDark(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeUser]);

  const postIts = [...RECORDS[activeUser]].reverse();

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
          <Button variant="outlined" color="inherit">
            로그인
          </Button>

          <Box component="nav" aria-label="사용자 선택">
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              사용자 목록
            </Typography>
            <Stack spacing={1}>
              {USERS.map((name, i) => (
                <Button
                  key={name}
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={() => setActiveUser(i)}
                  sx={{
                    justifyContent: "flex-start",
                    py: 1.25,
                    px: 1.5,
                    fontSize: 14,
                    ...(i === activeUser
                      ? {
                          bgcolor: "action.selected",
                          color: "text.primary",
                          borderColor: "text.secondary",
                        }
                      : {
                          color: "text.secondary",
                        }),
                  }}
                >
                  {name}
                </Button>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box
          component="main"
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <Stack
            direction="row"
            sx={{
              mb: 2.5,
              gap: 1.5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
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

          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              minHeight: 0,
              p: "16px 24px 24px",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              borderColor: "divider",
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
              }}
            >
              {postIts.map((record) => (
                <PostItCard key={record.date} record={record} />
              ))}
            </Box>
          </Paper>
        </Box>

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
          <Typography variant="caption" color="text.secondary">
            완료 기록
          </Typography>
          <Stack spacing={1.25} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {COMPLETION_LOG.map((entry) => (
              <Paper
                key={entry.id}
                component="li"
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderColor: "divider",
                  lineHeight: 1.4,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {entry.user}
                </Typography>
                <Typography
                  variant="body2"
                  color={dark ? "#ccc" : "text.secondary"}
                >
                  {entry.task}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.75 }}
                >
                  {entry.time}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
