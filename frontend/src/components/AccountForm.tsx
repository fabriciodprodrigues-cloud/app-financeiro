import { FormEvent, useState } from 'react'
import { Account } from '../types/index'

interface AccountFormProps {
  onSubmit: (data: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  initialData?: Account
  isLoading?: boolean
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1']

export function AccountForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: AccountFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [type, setType] = useState<'checking' | 'savings' | 'investment' | 'credit'>(
    initialData?.type || 'checking'
  )
  const [balance, setBalance] = useState(initialData?.balance?.toString() || '0')
  const [currency, setCurrency] = useState(initialData?.currency || 'BRL')
  const [color, setColor] = useState(initialData?.color || '#0ea5e9')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Nome da conta é obrigatório')
      return
    }

    try {
      await onSubmit({
        name,
        type,
        balance: parseFloat(balance),
        currency,
        color,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold">{initialData ? '✏️ Editar' : '➕ Nova'} Conta</h2>

      {/* Nome */}
      <div className="form-group">
        <label htmlFor="name" className="label">
          Nome da Conta *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Conta Principal"
          className="input"
          disabled={isLoading}
          required
        />
      </div>

      {/* Tipo */}
      <div className="form-group">
        <label htmlFor="type" className="label">
          Tipo de Conta *
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="input"
          disabled={isLoading}
          required
        >
          <option value="checking">🏦 Conta Corrente</option>
          <option value="savings">💰 Poupança</option>
          <option value="investment">📈 Investimentos</option>
          <option value="credit">💳 Cartão de Crédito</option>
        </select>
      </div>

      {/* Saldo */}
      <div className="form-group">
        <label htmlFor="balance" className="label">
          Saldo Inicial
        </label>
        <input
          id="balance"
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="0.00"
          className="input"
          disabled={isLoading}
        />
      </div>

      {/* Moeda */}
      <div className="form-group">
        <label htmlFor="currency" className="label">
          Moeda
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input"
          disabled={isLoading}
        >
          <option value="BRL">BRL - Real Brasileiro</option>
          <option value="USD">USD - Dólar Americano</option>
          <option value="EUR">EUR - Euro</option>
        </select>
      </div>

      {/* Cor */}
      <div className="form-group">
        <label className="label">Cor</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-700'
              }`}
              style={{ backgroundColor: c }}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-sm">
          {error}
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? '⏳ Salvando...' : initialData ? '✏️ Atualizar' : '➕ Criar'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary flex-1">
          ✕ Cancelar
        </button>
      </div>
    </form>
  )
}
