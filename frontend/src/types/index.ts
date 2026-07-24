export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Account {
  id: string
  userId: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'credit'
  balance: number
  currency: string
  color: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  userId: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: Date
  tags?: string[]
  receipt?: string
  syncStatus: 'pending' | 'synced' | 'failed'
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id: string
  userId: string
  categoryId: string
  month: string
  limit: number
  spent: number
  alert: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SyncQueue {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'transaction' | 'account' | 'category'
  data: unknown
  timestamp: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
