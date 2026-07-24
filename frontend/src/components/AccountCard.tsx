import { Account } from '../types/index'

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onDelete: (id: string) => void
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      checking: '🏦 Conta Corrente',
      savings: '💰 Poupança',
      investment: '📈 Investimentos',
      credit: '💳 Cartão de Crédito',
    }
    return types[type] || type
  }

  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${account.color}`,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{getTypeLabel(account.type)}</p>
          <h3 className="text-xl font-bold mt-1">{account.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(account)}
            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            title="Deletar"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Saldo</span>
          <span className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(account.balance)}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Criada em {new Date(account.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  )
}
