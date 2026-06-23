import type { NextRequest } from 'next/server'
import { db } from '@/lib/json-db'
import type { Todo } from '@/lib/types'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const todos = await (userId ? db.todos.byUser(userId) : db.todos.all())
  return Response.json(todos)
}

export async function POST(request: Request) {
  const { userId, text } = await request.json() as { userId: string; text: string }

  if (!userId || !text?.trim()) {
    return Response.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]
  const todo: Todo = {
    id: crypto.randomUUID(),
    userId,
    text: text.trim(),
    completed: false,
    completedAt: null,
    createdAt: today,
  }

  return Response.json(await db.todos.create(todo), { status: 201 })
}
