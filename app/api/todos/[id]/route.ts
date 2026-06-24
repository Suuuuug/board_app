import { db } from '@/lib/json-db'
import type { Completion } from '@/lib/types'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const patch = await request.json() as { completed?: boolean; completedAt?: string | null }

  const updated = await db.todos.update(id, patch)
  if (!updated) return Response.json({ error: '찾을 수 없습니다.' }, { status: 404 })

  if (patch.completed === true && updated.completedAt) {
    const user = await db.users.byId(updated.userId)
    if (user) {
      const entry: Completion = {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        todoId: updated.id,
        task: updated.text,
        completedAt: updated.completedAt,
      }
      await db.completions.create(entry)
      await db.completions.trim(10)
    }
  } else if (patch.completed === false) {
    await db.completions.deleteByTodoId(id)
  }

  return Response.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.completions.deleteByTodoId(id)
  const ok = await db.todos.remove(id)
  if (!ok) return Response.json({ error: '찾을 수 없습니다.' }, { status: 404 })
  return new Response(null, { status: 204 })
}
