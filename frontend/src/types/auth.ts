export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}
