import { db } from '@/lib/json-db'

export async function GET() {
  const users = db.users.all().map(({ pin: _pin, ...rest }) => rest)
  return Response.json(users)
}
