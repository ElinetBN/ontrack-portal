export interface User {
  id: string
  email: string
  name: string
  portal: string
}

export const AUTH_COOKIE = "auth-token"
export const USER_COOKIE = "user-data"

export function setAuthCookie(user: User) {
  const userData = JSON.stringify(user)
  document.cookie = `${AUTH_COOKIE}=authenticated; path=/; max-age=86400` // 24 hours
  document.cookie = `${USER_COOKIE}=${encodeURIComponent(userData)}; path=/; max-age=86400`
}

export function getAuthUser(): User | null {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split(";")
  const userCookie = cookies.find((cookie) => cookie.trim().startsWith(`${USER_COOKIE}=`))

  if (!userCookie) return null

  try {
    const userData = decodeURIComponent(userCookie.split("=")[1])
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function clearAuthCookies() {
  document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  document.cookie = `${USER_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function logout() {
  clearAuthCookies()
  window.location.href = "/auth/signin"
}
