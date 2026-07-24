import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const { login, register, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      // Usar setTimeout para garantir que o estado foi atualizado
      setTimeout(() => {
        navigate('/dashboard')
      }, 100)
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  const handleRegister = async (email: string, password: string) => {
    try {
      const name = email.split('@')[0]
      console.log('Iniciando registro...', { email, name })
      await register(email, password, name)

      console.log('Registro sucesso!')
      console.log('Token:', localStorage.getItem('authToken'))
      console.log('User:', localStorage.getItem('authUser'))

      // Usar setTimeout para garantir que o estado foi atualizado
      setTimeout(() => {
        console.log('Navegando para dashboard...')
        navigate('/dashboard')
      }, 100)
    } catch (error) {
      console.error('Erro no registro:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-2">💰</h1>
          <h2 className="text-3xl font-bold text-white mb-2">App Financeiro</h2>
          <p className="text-primary-100 dark:text-gray-300">
            Gerencie suas finanças pessoais com facilidade
          </p>
        </div>

        {/* Form */}
        <LoginForm
          onSubmit={isRegister ? handleRegister : handleLogin}
          isLoading={isLoading}
          isRegister={isRegister}
          onToggleMode={() => setIsRegister(!isRegister)}
        />

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="text-center text-white text-sm">
            <p className="text-2xl mb-1">✅</p>
            <p>Offline</p>
          </div>
          <div className="text-center text-white text-sm">
            <p className="text-2xl mb-1">📊</p>
            <p>Relatórios</p>
          </div>
          <div className="text-center text-white text-sm">
            <p className="text-2xl mb-1">🔒</p>
            <p>Seguro</p>
          </div>
          <div className="text-center text-white text-sm">
            <p className="text-2xl mb-1">📱</p>
            <p>Responsivo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
