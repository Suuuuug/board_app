import { db } from '@/lib/json-db'

export async function GET() {
  return Response.json(db.completions.all())
}
