import { prisma } from './prisma'
import type { Completion, Todo, User } from './types'

export const db = {
  users: {
    all: (): Promise<User[]> => prisma.user.findMany() as Promise<User[]>,
    byId: (id: string): Promise<User | null> =>
      prisma.user.findUnique({ where: { id } }) as Promise<User | null>,
    byName: (name: string): Promise<User | null> =>
      prisma.user.findUnique({ where: { name } }) as Promise<User | null>,
  },
  todos: {
    all: (): Promise<Todo[]> => prisma.todo.findMany() as Promise<Todo[]>,
    byUser: (userId: string): Promise<Todo[]> =>
      prisma.todo.findMany({ where: { userId } }) as Promise<Todo[]>,
    byId: (id: string): Promise<Todo | null> =>
      prisma.todo.findUnique({ where: { id } }) as Promise<Todo | null>,
    create: ({ id, userId, text, completed, completedAt, createdAt }: Todo): Promise<Todo> =>
      prisma.todo.create({ data: { id, userId, text, completed, completedAt, createdAt } }) as Promise<Todo>,
    update: async (id: string, patch: Partial<Todo>): Promise<Todo | null> => {
      try {
        return await prisma.todo.update({ where: { id }, data: patch }) as Todo
      } catch {
        return null
      }
    },
    remove: async (id: string): Promise<boolean> => {
      try {
        await prisma.todo.delete({ where: { id } })
        return true
      } catch {
        return false
      }
    },
  },
  completions: {
    all: (): Promise<Completion[]> =>
      prisma.completion.findMany({ orderBy: { completedAt: 'desc' } }) as Promise<Completion[]>,
    create: ({ id, userId, userName, todoId, task, completedAt }: Completion): Promise<Completion> =>
      prisma.completion.create({ data: { id, userId, userName, todoId, task, completedAt } }) as Promise<Completion>,
  },
}
