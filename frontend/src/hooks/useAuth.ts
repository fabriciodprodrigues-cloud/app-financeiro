import { useState, useEffect, useCallback } from 'react'
import { AuthContextType, User, AuthResponse } from '../types/auth'
import { apiClient } from '../services/api'
import { LocalDB } from '../services/db'

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Recuperar usuário ao montar componente
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        setIsAuthenticated(true)
        apiClient.setToken(savedToken)
      } catch (error) {
        console.error('Erro ao recuperar dados:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true)
      try {
        const response: AuthResponse = await apiClient.register(email, password, name)

        const userData = response.user
        setUser(userData)
        setToken(response.token)
        apiClient.setToken(response.token)
        setIsAuthenticated(true)

        // Salvar no localStorage
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('authUser', JSON.stringify(userData))

        // Limpar dados locais
        await LocalDB.clearAllData()
      } catch (error) {
        console.error('Erro ao registrar:', error)
        setIsAuthenticated(false)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response: AuthResponse = await apiClient.login(email, password)

      const userData = response.user
      setUser(userData)
      setToken(response.token)
      apiClient.setToken(response.token)
      setIsAuthenticated(true)

      // Salvar no localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('authUser', JSON.stringify(userData))

      // Limpar dados locais
      await LocalDB.clearAllData()
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      // Limpar dados locais
      await LocalDB.clearAllData()

      // Limpar estado
      setUser(null)
      setToken(null)
      apiClient.logout()
      setIsAuthenticated(false)

      // Limpar localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')

      // Redirecionar para login
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
