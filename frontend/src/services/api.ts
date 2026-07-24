import axios, { AxiosInstance } from 'axios'
import { AuthResponse, User } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Recuperar token do localStorage
    const savedToken = localStorage.getItem('authToken')
    if (savedToken) {
      this.setToken(savedToken)
    }

    // Interceptor para adicionar token em requisições
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('authToken', token)
  }

  logout() {
    this.token = null
    localStorage.removeItem('authToken')
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.client.post<any>('/auth/register', {
      email,
      password,
      name,
    })

    // Extrair dados da resposta
    const { data } = response.data
    return {
      user: data.user,
      token: data.token,
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<any>('/auth/login', {
      email,
      password,
    })

    // Extrair dados da resposta
    const { data } = response.data
    return {
      user: data.user,
      token: data.token,
    }
  }

  async getMe(): Promise<User> {
    const response = await this.client.get<User>('/users/me')
    return response.data
  }

  // Accounts endpoints
  async getAccounts() {
    const response = await this.client.get('/accounts')
    return response.data
  }

  async createAccount(data: any) {
    const response = await this.client.post('/accounts', data)
    return response.data
  }

  async updateAccount(id: string, data: any) {
    const response = await this.client.put(`/accounts/${id}`, data)
    return response.data
  }

  async deleteAccount(id: string) {
    const response = await this.client.delete(`/accounts/${id}`)
    return response.data
  }

  // Transactions endpoints
  async getTransactions(filters?: any) {
    const response = await this.client.get('/transactions', { params: filters })
    return response.data
  }

  async createTransaction(data: any) {
    const response = await this.client.post('/transactions', data)
    return response.data
  }

  async updateTransaction(id: string, data: any) {
    const response = await this.client.put(`/transactions/${id}`, data)
    return response.data
  }

  async deleteTransaction(id: string) {
    const response = await this.client.delete(`/transactions/${id}`)
    return response.data
  }

  // Categories endpoints
  async getCategories() {
    const response = await this.client.get('/categories')
    return response.data
  }

  async createCategory(data: any) {
    const response = await this.client.post('/categories', data)
    return response.data
  }

  // Stats endpoints
  async getStats(period: 'month' | 'year' = 'month') {
    const response = await this.client.get(`/stats/${period}`)
    return response.data
  }

  // Sync endpoints
  async sync(changes: any, lastSync?: string) {
    const response = await this.client.post('/sync', {
      changes,
      lastSync,
    })
    return response.data
  }
}

export const apiClient = new ApiClient()
