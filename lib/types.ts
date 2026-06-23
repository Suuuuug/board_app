export type User = {
  id: string
  name: string
  pin: string
}

export type PublicUser = Omit<User, 'pin'>

export type Todo = {
  id: string
  userId: string
  text: string
  completed: boolean
  completedAt: string | null
  createdAt: string
}

export type Completion = {
  id: string
  userId: string
  userName: string
  todoId: string
  task: string
  completedAt: string
}

export type PostItRecord = {
  date: string
  todos: Todo[]
  isToday: boolean
}
