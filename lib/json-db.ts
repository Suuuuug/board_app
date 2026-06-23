import fs from 'fs'
import path from 'path'
import type { User, Todo, Completion } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

function read<T>(file: string): T[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')) as T[]
}

function write<T>(file: string, data: T[]): void {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2))
}

export const db = {
  users: {
    all: () => read<User>('users.json'),
    byId: (id: string) => read<User>('users.json').find(u => u.id === id) ?? null,
    byName: (name: string) => read<User>('users.json').find(u => u.name === name) ?? null,
  },
  todos: {
    all: () => read<Todo>('todos.json'),
    byUser: (userId: string) => read<Todo>('todos.json').filter(t => t.userId === userId),
    byId: (id: string) => read<Todo>('todos.json').find(t => t.id === id) ?? null,
    create(todo: Todo): Todo {
      const list = read<Todo>('todos.json')
      list.push(todo)
      write('todos.json', list)
      return todo
    },
    update(id: string, patch: Partial<Todo>): Todo | null {
      const list = read<Todo>('todos.json')
      const i = list.findIndex(t => t.id === id)
      if (i === -1) return null
      list[i] = { ...list[i], ...patch }
      write('todos.json', list)
      return list[i]
    },
    remove(id: string): boolean {
      const list = read<Todo>('todos.json')
      const i = list.findIndex(t => t.id === id)
      if (i === -1) return false
      list.splice(i, 1)
      write('todos.json', list)
      return true
    },
  },
  completions: {
    all: () => read<Completion>('completions.json'),
    create(c: Completion): Completion {
      const list = read<Completion>('completions.json')
      list.unshift(c)
      write('completions.json', list)
      return c
    },
  },
}
