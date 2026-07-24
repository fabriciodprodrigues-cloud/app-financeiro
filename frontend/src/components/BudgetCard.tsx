import { Budget, Transaction } from '../types/index'

interface BudgetCardProps {
  budget: Budget
  spent: number
  transactions: Transaction[]
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export function BudgetCard({ budget, spent, onEdit, onDelete }: BudgetCardProps) {
  const percentage = (spent / budget.limit) * 100
  const remaining = budget.limit - spent
  const isExceeded = spent > budget.limit

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      cat_1: '🍔 Alimentação',
      cat_2: '🚗 Transporte',
      cat_3: '🏠 Moradia',
      cat_4: '🎬 Entretenimento',
      cat_5: '💊 Saúde',
      cat_6: '📚 Educação',
      cat_7: '💼 Trabalho',
    }
    return categories[categoryId] || categoryId
  }

  const getStatusColor = () => {
    if (isExceeded) return 'text-red-600'
    if (percentage > 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getProgressColor = () => {
    if (isExceeded) return 'bg-red-500'
    if (percentage > 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const month = budget.month.split('-')
  const monthName = new Date(parseInt(month[0]), parseInt(month[1]) - 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{monthName}</p>
          <h3 className="text-lg font-semibold mt-1">{getCategoryName(budget.categoryId)}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            title="Deletar"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Progresso */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Gasto</span>
          <span className={`font-bold ${getStatusColor()}`}>{formatCurrency(spent)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {percentage.toFixed(0)}% do orçamento
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Limite: {formatCurrency(budget.limit)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className={`p-3 rounded-lg ${isExceeded ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
        <p className={`text-sm font-medium ${isExceeded ? 'text-red-700 dark:text-red-200' : 'text-green-700 dark:text-green-200'}`}>
          {isExceeded ? (
            <>
              ⚠️ Limite excedido em {formatCurrency(Math.abs(remaining))}
            </>
          ) : (
            <>
              ✅ Faltam {formatCurrency(remaining)} para atingir o limite
            </>
          )}
        </p>
      </div>

      {/* Alerta */}
      {budget.alert && percentage > 75 && !isExceeded && (
        <div className="mt-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs text-yellow-700 dark:text-yellow-200">
            🔔 Você já gastou {percentage.toFixed(0)}% do orçamento
          </p>
        </div>
      )}
    </div>
  )
}
