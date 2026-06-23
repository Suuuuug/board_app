import { db } from '@/lib/json-db'

export async function GET() {
  return Response.json(await db.completions.all())
}
