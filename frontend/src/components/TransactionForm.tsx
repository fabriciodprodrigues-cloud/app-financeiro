import { FormEvent, useState } from 'react'
import { Transaction } from '../types/index'

interface TransactionFormProps {
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'syncStatus'>) => Promise<void>
  onCancel: () => void
  initialData?: Transaction
  isLoading?: boolean
}

export function TransactionForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense')
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [date, setDate] = useState(
    initialData ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [accountId, setAccountId] = useState(initialData?.accountId || '')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!amount || !description || !categoryId || !accountId) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        categoryId,
        accountId,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold">{initialData ? '✏️ Editar' : '➕ Nova'} Transação</h2>

      {/* Tipo */}
      <div className="form-group">
        <label className="label">Tipo</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="income"
              checked={type === 'income'}
              onChange={(e) => setType(e.target.value as 'income')}
              disabled={isLoading}
            />
            <span className="text-green-600 font-medium">📈 Receita</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="expense"
              checked={type === 'expense'}
              onChange={(e) => setType(e.target.value as 'expense')}
              disabled={isLoading}
            />
            <span className="text-red-600 font-medium">📉 Despesa</span>
          </label>
        </div>
      </div>

      {/* Valor */}
      <div className="form-group">
        <label htmlFor="amount" className="label">
          Valor *
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="input"
          disabled={isLoading}
          required
        />
      </div>

      {/* Descrição */}
      <div className="form-group">
        <label htmlFor="description" className="label">
          Descrição *
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Compras no supermercado"
          className="input"
          disabled={isLoading}
          required
        />
      </div>

      {/* Data */}
      <div className="form-group">
        <label htmlFor="date" className="label">
          Data *
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
          disabled={isLoading}
          required
        />
      </div>

      {/* Categoria */}
      <div className="form-group">
        <label htmlFor="category" className="label">
          Categoria *
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="input"
          disabled={isLoading}
          required
        >
          <option value="">Selecione uma categoria</option>
          <option value="cat_1">🍔 Alimentação</option>
          <option value="cat_2">🚗 Transporte</option>
          <option value="cat_3">🏠 Moradia</option>
          <option value="cat_4">🎬 Entretenimento</option>
          <option value="cat_5">💊 Saúde</option>
          <option value="cat_6">📚 Educação</option>
          <option value="cat_7">💼 Trabalho</option>
        </select>
      </div>

      {/* Conta */}
      <div className="form-group">
        <label htmlFor="account" className="label">
          Conta *
        </label>
        <select
          id="account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="input"
          disabled={isLoading}
          required
        >
          <option value="">Selecione uma conta</option>
          <option value="acc_1">💳 Conta Corrente</option>
          <option value="acc_2">💰 Poupança</option>
          <option value="acc_3">💎 Investimentos</option>
        </select>
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
          {isLoading ? '⏳ Salvando...' : initialData ? '✏️ Atualizar' : '➕ Adicionar'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary flex-1">
          ✕ Cancelar
        </button>
      </div>
    </form>
  )
}
