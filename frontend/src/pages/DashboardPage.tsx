import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { SummaryCard } from '../components/SummaryCard'
import { TransactionList } from '../components/TransactionList'
import { Transaction } from '../types/index'
import { LocalDB } from '../services/db'

interface DashboardPageProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  userName: string
}

export function DashboardPage({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userName,
}: DashboardPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalBalance, setTotalBalance] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyExpense, setMonthlyExpense] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Mock data - Em produção, buscar do API
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user_1',
          accountId: 'acc_1',
          categoryId: 'cat_1',
          type: 'income',
          amount: 5000,
          description: 'Salário',
          date: new Date(),
          syncStatus: 'synced',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user_1',
          accountId: 'acc_1',
          categoryId: 'cat_2',
          type: 'expense',
          amount: 500,
          description: 'Supermercado',
          date: new Date(Date.now() - 86400000),
          syncStatus: 'synced',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          userId: 'user_1',
          accountId: 'acc_1',
          categoryId: 'cat_3',
          type: 'expense',
          amount: 1200,
          description: 'Aluguel',
          date: new Date(Date.now() - 172800000),
          syncStatus: 'synced',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      setTransactions(mockTransactions)

      // Calcular totais
      const income = mockTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expense = mockTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const balance = income - expense

      setTotalBalance(balance)
      setMonthlyIncome(income)
      setMonthlyExpense(expense)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout
      title="Dashboard"
      isDarkMode={isDarkMode}
      onToggleDarkMode={onToggleDarkMode}
      onLogout={onLogout}
      userName={userName}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Saldo Total"
          value={totalBalance}
          type="balance"
          icon="💰"
          trend={{ value: 5.2, isPositive: true }}
        />
        <SummaryCard
          title="Receita do Mês"
          value={monthlyIncome}
          type="income"
          icon="📈"
          trend={{ value: 12, isPositive: true }}
        />
        <SummaryCard
          title="Despesa do Mês"
          value={monthlyExpense}
          type="expense"
          icon="📉"
          trend={{ value: 3, isPositive: false }}
        />
        <SummaryCard
          title="Economia"
          value={monthlyIncome - monthlyExpense}
          type="savings"
          icon="🎯"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Transações Recentes</h2>
          <a
            href="/transactions"
            className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
          >
            Ver Todas →
          </a>
        </div>

        <TransactionList
          transactions={transactions.slice(0, 5)}
          isLoading={isLoading}
          emptyMessage="Nenhuma transação registrada"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/transactions/new"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">➕ Nova Transação</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Registre uma receita ou despesa
          </p>
        </a>

        <a
          href="/accounts"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">💳 Gerenciar Contas</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Adicione ou edite suas contas
          </p>
        </a>

        <a
          href="/reports"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">📊 Relatórios</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Veja análises detalhadas
          </p>
        </a>
      </div>
    </Layout>
  )
}
