import { http } from './http'

interface LinkResponse {
  link: string
}

export async function issueLink(): Promise<string> {
  const response = await http.post<LinkResponse>('/api/telegram/link')

  return response.data.link
}

export async function unlink(): Promise<void> {
  await http.delete('/api/telegram/link')
}
