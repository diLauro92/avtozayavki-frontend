import type { User } from '@/types'
import { http } from './http'

async function getCsrfCookie(): Promise<void> {
  await http.get('/sanctum/csrf-cookie')
}

export async function login(email: string, password: string, remember: boolean): Promise<User> {
  await getCsrfCookie()

  const response = await http.post('/api/login', { email, password, remember })

  return response.data
}

// получить текущего юзера по сессии
export async function fetchUser(): Promise<User> {
  const response = await http.get('/api/user')

  return response.data
}

export async function logout(): Promise<void> {
  await getCsrfCookie()

  await http.post('/api/logout')
}
