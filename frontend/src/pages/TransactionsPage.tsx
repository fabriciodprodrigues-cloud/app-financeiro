import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { Transaction } from '../types/index'
import { LocalDB } from '../services/db'

interface TransactionsPageProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  userName: string
}

export function TransactionsPage({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userName,
}: TransactionsPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')

  const userId = JSON.parse(localStorage.getItem('authUser') || '{}').id || 'demo_user'

  useEffect(() => {
    loadTransactions()
  }, [filterType])

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      const allTransactions = await LocalDB.getTransactions(userId)
      const filtered =
        filterType === 'all' ? allTransactions : allTransactions.filter((t) => t.type === filterType)
      setTransactions(filtered)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'syncStatus'>) => {
    const newTransaction: Transaction = {
      id: `trans_${Date.now()}`,
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'pending',
    }

    await LocalDB.saveTransaction(newTransaction)
    setShowForm(false)
    await loadTransactions()
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      await LocalDB.deleteTransaction(id)
      await loadTransactions()
    }
  }

  const editingTransaction = transactions.find((t) => t.id === editingId)

  return (
    <Layout
      title="Transações"
      isDarkMode={isDarkMode}
      onToggleDarkMode={onToggleDarkMode}
      onLogout={onLogout}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Formulário */}
        {showForm && (
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            initialData={editingTransaction}
          />
        )}

        {/* Filtros e Ações */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Transações</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? '✕ Fechar' : '➕ Nova'}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              📈 Receitas
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              📉 Despesas
            </button>
          </div>
        </div>

        {/* Lista */}
        <TransactionList
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          isLoading={isLoading}
          emptyMessage="Nenhuma transação registrada"
        />

        {/* Resumo */}
        {transactions.length > 0 && (
          <div className="card bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-3">Resumo</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total de Transações</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter((t) => t.type === 'income').length}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions.filter((t) => t.type === 'expense').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
