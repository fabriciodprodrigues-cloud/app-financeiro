import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { BudgetForm } from '../components/BudgetForm'
import { BudgetCard } from '../components/BudgetCard'
import { Budget, Transaction } from '../types/index'
import { LocalDB } from '../services/db'

interface BudgetsPageProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  userName: string
}

export function BudgetsPage({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userName,
}: BudgetsPageProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const userId = JSON.parse(localStorage.getItem('authUser') || '{}').id || 'demo_user'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const allTransactions = await LocalDB.getTransactions(userId)
      setTransactions(allTransactions)
      loadBudgets()
    } finally {
      setIsLoading(false)
    }
  }

  const loadBudgets = async () => {
    // Simular carregamento de orçamentos do localStorage
    const savedBudgets = localStorage.getItem('budgets')
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets))
      } catch (error) {
        console.error('Erro ao carregar orçamentos:', error)
      }
    }
  }

  const handleAddBudget = async (
    data: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>
  ) => {
    const newBudget: Budget = {
      id: `budget_${Date.now()}`,
      userId,
      ...data,
      spent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedBudgets = [...budgets, newBudget]
    setBudgets(updatedBudgets)
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets))
    setShowForm(false)
  }

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este orçamento?')) {
      const updatedBudgets = budgets.filter((b) => b.id !== id)
      setBudgets(updatedBudgets)
      localStorage.setItem('budgets', JSON.stringify(updatedBudgets))
    }
  }

  const handleUpdateBudget = async (
    data: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingId) return

    const updatedBudgets = budgets.map((b) =>
      b.id === editingId
        ? { ...b, ...data, updatedAt: new Date() }
        : b
    )
    setBudgets(updatedBudgets)
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets))
    setShowForm(false)
    setEditingId(null)
  }

  const getSpentForBudget = (categoryId: string, month: string) => {
    return transactions
      .filter((t) => {
        const tMonth = new Date(t.date).toISOString().slice(0, 7)
        return t.categoryId === categoryId && t.type === 'expense' && tMonth === month
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const editingBudget = budgets.find((b) => b.id === editingId)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentMonthBudgets = budgets.filter((b) => b.month === currentMonth)
  const otherBudgets = budgets.filter((b) => b.month !== currentMonth)

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + getSpentForBudget(b.categoryId, b.month), 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <Layout
      title="Orçamentos"
      isDarkMode={isDarkMode}
      onToggleDarkMode={onToggleDarkMode}
      onLogout={onLogout}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Formulário */}
        {showForm && (
          <BudgetForm
            onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            initialData={editingBudget}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Orçamentos</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? '✕ Fechar' : '➕ Novo Orçamento'}
          </button>
        </div>

        {/* Resumo Total */}
        {budgets.length > 0 && (
          <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 text-sm">Total Alocado</p>
                <p className="text-3xl font-bold">{formatCurrency(totalLimit)}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Gasto</p>
                <p className={`text-3xl font-bold ${totalSpent > totalLimit ? 'text-red-300' : 'text-green-300'}`}>
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">⏳ Carregando orçamentos...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Você ainda não possui orçamentos registrados</p>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn-primary inline-block">
                ➕ Criar Primeiro Orçamento
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Este Mês */}
            {currentMonthBudgets.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">📅 Este Mês</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMonthBudgets.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      spent={getSpentForBudget(budget.categoryId, budget.month)}
                      transactions={transactions}
                      onEdit={(b) => {
                        setEditingId(b.id)
                        setShowForm(true)
                      }}
                      onDelete={handleDeleteBudget}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Outros Meses */}
            {otherBudgets.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">📆 Outros Meses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherBudgets.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      spent={getSpentForBudget(budget.categoryId, budget.month)}
                      transactions={transactions}
                      onEdit={(b) => {
                        setEditingId(b.id)
                        setShowForm(true)
                      }}
                      onDelete={handleDeleteBudget}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Dicas */}
        <div className="card bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Dicas de Orçamento</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Defina limites realistas para cada categoria</li>
            <li>• Ative alertas para não ultrapassar 75% do orçamento</li>
            <li>• Revise seus orçamentos mensalmente</li>
            <li>• Ajuste conforme suas necessidades mudam</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
