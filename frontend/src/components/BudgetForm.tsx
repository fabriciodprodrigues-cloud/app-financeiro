import { FormEvent, useState } from 'react'
import { Budget } from '../types/index'

interface BudgetFormProps {
  onSubmit: (data: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  initialData?: Budget
  isLoading?: boolean
}

export function BudgetForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: BudgetFormProps) {
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [month, setMonth] = useState(initialData?.month || currentMonth)
  const [limit, setLimit] = useState(initialData?.limit?.toString() || '')
  const [alert, setAlert] = useState(initialData?.alert ?? true)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!categoryId || !limit) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    try {
      await onSubmit({
        categoryId,
        month,
        limit: parseFloat(limit),
        alert,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold">{initialData ? '✏️ Editar' : '➕ Novo'} Orçamento</h2>

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

      {/* Mês */}
      <div className="form-group">
        <label htmlFor="month" className="label">
          Mês *
        </label>
        <input
          id="month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input"
          disabled={isLoading}
          required
        />
      </div>

      {/* Limite */}
      <div className="form-group">
        <label htmlFor="limit" className="label">
          Limite de Despesa *
        </label>
        <input
          id="limit"
          type="number"
          step="0.01"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="0.00"
          className="input"
          disabled={isLoading}
          required
        />
      </div>

      {/* Alertas */}
      <div className="form-group">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={alert}
            onChange={(e) => setAlert(e.target.checked)}
            disabled={isLoading}
          />
          <span className="text-sm font-medium">🔔 Receber alertas quando ultrapassar 75%</span>
        </label>
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
