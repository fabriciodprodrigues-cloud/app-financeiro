import Dexie, { Table } from 'dexie'
import { Transaction, Account, Category, Budget, SyncQueue } from '../types/index'

export class AppDatabase extends Dexie {
  transactions!: Table<Transaction>
  accounts!: Table<Account>
  categories!: Table<Category>
  budgets!: Table<Budget>
  syncQueue!: Table<SyncQueue>

  constructor() {
    super('app_financeiro')
    this.version(1).stores({
      transactions: '++id, userId, accountId, date, syncStatus',
      accounts: '++id, userId, type',
      categories: '++id, userId, type',
      budgets: '++id, userId, month',
      syncQueue: '++id, userId, timestamp',
    })
  }
}

export const db = new AppDatabase()

// Funções helper para sincronização
export class LocalDB {
  static async saveTransaction(transaction: Transaction) {
    try {
      await db.transactions.put(transaction)
      await this.addToSyncQueue('create', 'transaction', transaction)
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
      throw error
    }
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>) {
    try {
      await db.transactions.update(id, updates)
      await this.addToSyncQueue('update', 'transaction', { id, ...updates })
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
      throw error
    }
  }

  static async deleteTransaction(id: string) {
    try {
      await db.transactions.delete(id)
      await this.addToSyncQueue('delete', 'transaction', { id })
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
      throw error
    }
  }

  static async getTransactions(userId: string, filters?: any) {
    try {
      let query = db.transactions.where('userId').equals(userId)

      if (filters?.accountId) {
        query = query.and(t => t.accountId === filters.accountId)
      }

      if (filters?.categoryId) {
        query = query.and(t => t.categoryId === filters.categoryId)
      }

      if (filters?.startDate && filters?.endDate) {
        query = query.and(
          t => t.date >= filters.startDate && t.date <= filters.endDate
        )
      }

      const transactions = await query.toArray()
      return transactions.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
      return []
    }
  }

  static async saveAccount(account: Account) {
    try {
      await db.accounts.put(account)
      await this.addToSyncQueue('create', 'account', account)
    } catch (error) {
      console.error('Erro ao salvar conta:', error)
      throw error
    }
  }

  static async getAccounts(userId: string) {
    try {
      return await db.accounts.where('userId').equals(userId).toArray()
    } catch (error) {
      console.error('Erro ao buscar contas:', error)
      return []
    }
  }

  static async saveCategory(category: Category) {
    try {
      await db.categories.put(category)
      await this.addToSyncQueue('create', 'category', category)
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      throw error
    }
  }

  static async getCategories(userId: string, type?: 'income' | 'expense') {
    try {
      let query = db.categories.where('userId').equals(userId)

      if (type) {
        const categories = await query.toArray()
        return categories.filter(c => c.type === type)
      }

      return await query.toArray()
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      return []
    }
  }

  static async addToSyncQueue(
    type: 'create' | 'update' | 'delete',
    entity: 'transaction' | 'account' | 'category',
    data: unknown
  ) {
    try {
      const syncItem: SyncQueue = {
        id: `sync_${Date.now()}_${Math.random()}`,
        type,
        entity,
        data,
        timestamp: new Date(),
      }
      await db.syncQueue.add(syncItem)
    } catch (error) {
      console.error('Erro ao adicionar à fila de sincronização:', error)
    }
  }

  static async getPendingSyncItems() {
    try {
      return await db.syncQueue.toArray()
    } catch (error) {
      console.error('Erro ao buscar itens pendentes de sincronização:', error)
      return []
    }
  }

  static async clearSyncQueue() {
    try {
      await db.syncQueue.clear()
    } catch (error) {
      console.error('Erro ao limpar fila de sincronização:', error)
    }
  }

  static async clearAllData() {
    try {
      await db.transactions.clear()
      await db.accounts.clear()
      await db.categories.clear()
      await db.budgets.clear()
      await db.syncQueue.clear()
    } catch (error) {
      console.error('Erro ao limpar dados locais:', error)
    }
  }
}
