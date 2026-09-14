import axios, { AxiosError } from 'axios'

interface LaravelErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly fields: Record<string, string[]> = {},
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<LaravelErrorResponse>) => {
    const status = error.response?.status ?? null
    const data = error.response?.data

    const isAuthRequest = ['/api/login', '/api/logout', '/api/user'].some((url) =>
      error.config?.url?.includes(url),
    )

    if (status === 401 && !isAuthRequest) {
      unauthorizedHandler?.()
    }

    const message =
      status === null
        ? 'Нет связи с сервером. Проверьте интернет.'
        : status === 401 ? 'Сессия истекла. Войдите заново.'
        : status === 403 ? 'Недостаточно прав для этого действия.'
        : status >= 500 ? 'Ошибка на сервере. Попробуйте позже.'
        : (data?.message ?? 'Что-то пошло не так. Попробуйте ещё раз.')

    return Promise.reject(new ApiError(message, status, data?.errors ?? {}))
  },
)
