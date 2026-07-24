import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { AccountForm } from '../components/AccountForm'
import { AccountCard } from '../components/AccountCard'
import { Account } from '../types/index'
import { LocalDB } from '../services/db'

interface AccountsPageProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  userName: string
}

export function AccountsPage({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userName,
}: AccountsPageProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const userId = JSON.parse(localStorage.getItem('authUser') || '{}').id || 'demo_user'

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    setIsLoading(true)
    try {
      const allAccounts = await LocalDB.getAccounts(userId)
      setAccounts(allAccounts)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAccount = async (
    data: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await LocalDB.saveAccount(newAccount)
    setShowForm(false)
    await loadAccounts()
  }

  const handleDeleteAccount = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta conta? Todas as transações relacionadas serão afetadas.')) {
      // Implementar delete quando houver a função
      // await LocalDB.deleteAccount(id)
      // await loadAccounts()
      alert('Funcionalidade de delete será implementada em breve')
    }
  }

  const editingAccount = accounts.find((a) => a.id === editingId)

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <Layout
      title="Contas"
      isDarkMode={isDarkMode}
      onToggleDarkMode={onToggleDarkMode}
      onLogout={onLogout}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Formulário */}
        {showForm && (
          <AccountForm
            onSubmit={handleAddAccount}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            initialData={editingAccount}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Minhas Contas</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? '✕ Fechar' : '➕ Nova Conta'}
          </button>
        </div>

        {/* Resumo Total */}
        {accounts.length > 0 && (
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <p className="text-white/80 mb-2">Saldo Total</p>
            <h2 className="text-4xl font-bold">{formatCurrency(totalBalance)}</h2>
            <p className="text-white/70 text-sm mt-3">{accounts.length} conta(s) ativa(s)</p>
          </div>
        )}

        {/* Contas */}
        {isLoading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">⏳ Carregando contas...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Você ainda não possui contas registradas</p>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn-primary inline-block">
                ➕ Criar Primeira Conta
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={(acc) => {
                  setEditingId(acc.id)
                  setShowForm(true)
                }}
                onDelete={handleDeleteAccount}
              />
            ))}
          </div>
        )}

        {/* Dicas */}
        {accounts.length > 0 && (
          <div className="card bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Dica</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Crie múltiplas contas para organizar melhor suas finanças. Por exemplo: uma para gastos diários, outra
              para poupança e outra para investimentos.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
