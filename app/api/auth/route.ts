import { db } from '@/lib/json-db'

export async function POST(request: Request) {
  const { name, pin } = await request.json() as { name: string; pin: string }

  const user = db.users.byName(name)
  if (!user || user.pin !== pin) {
    return Response.json({ error: '이름 또는 PIN이 올바르지 않습니다.' }, { status: 401 })
  }

  return Response.json({ id: user.id, name: user.name })
}
