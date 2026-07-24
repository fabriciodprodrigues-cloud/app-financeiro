import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { IncomeExpenseChart, CategoryBreakdownChart, TrendChart, SummaryStats } from '../components/Charts'
import { Transaction } from '../types/index'
import { LocalDB } from '../services/db'

interface ReportsPageProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  userName: string
}

export function ReportsPage({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userName,
}: ReportsPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'all' | 'month' | 'year'>('month')

  const userId = JSON.parse(localStorage.getItem('authUser') || '{}').id || 'demo_user'

  useEffect(() => {
    loadTransactions()
  }, [period])

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      const allTransactions = await LocalDB.getTransactions(userId)
      const now = new Date()

      let filtered = allTransactions

      if (period === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        filtered = allTransactions.filter(
          (t) => new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth
        )
      } else if (period === 'year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const endOfYear = new Date(now.getFullYear(), 11, 31)
        filtered = allTransactions.filter(
          (t) => new Date(t.date) >= startOfYear && new Date(t.date) <= endOfYear
        )
      }

      setTransactions(filtered)
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert('Não há transações para exportar')
      return
    }

    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.description,
      t.categoryId,
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.amount.toString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <Layout
      title="Relatórios"
      isDarkMode={isDarkMode}
      onToggleDarkMode={onToggleDarkMode}
      onLogout={onLogout}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Análise completa de suas finanças
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              📅 Este Mês
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'year'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              📊 Este Ano
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              📈 Tudo
            </button>
            <button onClick={exportToCSV} className="btn-secondary">
              📥 Exportar CSV
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">⏳ Carregando relatórios...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma transação encontrada para este período
            </p>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <SummaryStats transactions={transactions} />

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeExpenseChart transactions={transactions} />
              <CategoryBreakdownChart transactions={transactions} />
            </div>

            {/* Tendência */}
            <TrendChart transactions={transactions} />

            {/* Detalhes */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">📝 Detalhes das Transações</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                        Descrição
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                        Categoria
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4 text-sm">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">{transaction.description}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                              {transaction.categoryId}
                            </span>
                          </td>
                          <td
                            className={`py-3 px-4 text-sm font-semibold text-right ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {transactions.length > 10 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Mostrando 10 de {transactions.length} transações
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
