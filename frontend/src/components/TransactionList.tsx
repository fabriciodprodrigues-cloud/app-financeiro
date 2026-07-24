import { Transaction } from '../types/index'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'Nenhuma transação encontrada',
}: TransactionListProps) {
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          ⏳ Carregando transações...
        </p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Data
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Descrição
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Categoria
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Valor
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {transaction.description}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {transaction.type === 'income' ? '🟢' : '🔴'} {transaction.categoryId}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-sm font-semibold text-right ${
                    transaction.type === 'income'
                      ? 'text-success-600'
                      : 'text-danger-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatAmount(transaction.amount)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(transaction)}
                        className="px-2 py-1 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                      >
                        ✏️ Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="px-2 py-1 rounded text-xs font-medium bg-danger-100 dark:bg-danger-900 text-danger-700 dark:text-danger-100 hover:bg-danger-200 dark:hover:bg-danger-800 transition-colors"
                      >
                        🗑️ Deletar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sync Status Indicator */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>
          Mostrando {transactions.length} transação
          {transactions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
