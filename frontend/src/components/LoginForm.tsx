import { FormEvent, useState } from 'react'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  isLoading: boolean
  isRegister?: boolean
  onToggleMode?: () => void
}

export function LoginForm({
  onSubmit,
  isLoading,
  isRegister = false,
  onToggleMode,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Nome é obrigatório')
          return
        }
      }

      await onSubmit(email, password)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isRegister
            ? 'Erro ao registrar. Tente novamente.'
            : 'Email ou senha inválidos'
      )
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? '📝 Criar Conta' : '🔐 Login'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (only for register) */}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name" className="label">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="input"
                disabled={isLoading}
                required
              />
            </div>
          )}

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="input"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password" className="label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
              disabled={isLoading}
              required
              minLength={6}
            />
            {isRegister && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mínimo de 6 caracteres
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-danger-100 dark:bg-danger-900 text-danger-700 dark:text-danger-100 text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password || (isRegister && !name)}
            className="btn-primary w-full mt-6"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                {isRegister ? 'Criando conta...' : 'Entrando...'}
              </>
            ) : isRegister ? (
              'Criar Conta'
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Toggle mode */}
        {onToggleMode && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {isRegister
                ? 'Já tem uma conta?'
                : 'Não tem uma conta?'}
            </p>
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm"
            >
              {isRegister ? 'Fazer Login' : 'Criar Conta'}
            </button>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 text-sm">
        <p className="font-medium mb-2">💡 Demo Credentials</p>
        <p>Email: demo@example.com</p>
        <p>Senha: demo123</p>
      </div>
    </div>
  )
}
