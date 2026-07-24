import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Transaction } from '../types/index'

interface ChartsProps {
  transactions: Transaction[]
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#0ea5e9', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1']

export function IncomeExpenseChart({ transactions }: ChartsProps) {
  const data = [
    {
      name: 'Receita',
      value: transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    },
    {
      name: 'Despesa',
      value: transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">📊 Receita vs Despesa</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value as number)
            }
          />
          <Bar dataKey="value" fill="#0ea5e9">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryBreakdownChart({ transactions }: ChartsProps) {
  const categoryData = transactions.reduce(
    (acc, t) => {
      const existing = acc.find((item) => item.name === t.categoryId)
      if (existing) {
        existing.value += t.amount
      } else {
        acc.push({ name: t.categoryId, value: t.amount })
      }
      return acc
    },
    [] as { name: string; value: number }[]
  )

  if (categoryData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">🍰 Gastos por Categoria</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">Sem dados para exibir</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">🍰 Gastos por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value as number)
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TrendChart({ transactions }: ChartsProps) {
  // Agrupar por dia
  const trendData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce(
      (acc, t) => {
        const date = new Date(t.date).toLocaleDateString('pt-BR')
        const existing = acc.find((item) => item.date === date)

        if (existing) {
          if (t.type === 'income') {
            existing.receita += t.amount
          } else {
            existing.despesa += t.amount
          }
        } else {
          acc.push({
            date,
            receita: t.type === 'income' ? t.amount : 0,
            despesa: t.type === 'expense' ? t.amount : 0,
          })
        }
        return acc
      },
      [] as { date: string; receita: number; despesa: number }[]
    )

  if (trendData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">📈 Tendência</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">Sem dados para exibir</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">📈 Tendência</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value as number)
            }
          />
          <Legend />
          <Line type="monotone" dataKey="receita" stroke="#10b981" name="Receita" />
          <Line type="monotone" dataKey="despesa" stroke="#ef4444" name="Despesa" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SummaryStats({ transactions }: ChartsProps) {
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
        <p className="text-green-700 dark:text-green-200 text-sm font-medium">Total de Receitas</p>
        <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="card bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
        <p className="text-red-700 dark:text-red-200 text-sm font-medium">Total de Despesas</p>
        <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(totalExpense)}</p>
      </div>

      <div
        className={`card ${
          balance >= 0
            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
            : 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
        }`}
      >
        <p className={`text-sm font-medium ${balance >= 0 ? 'text-blue-700 dark:text-blue-200' : 'text-yellow-700 dark:text-yellow-200'}`}>
          Saldo
        </p>
        <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  )
}
