import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  userName?: string
}

export function Layout({
  children,
  title,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userName,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary-600">💰 AppFinanceiro</h1>
            {title && <p className="text-gray-600 dark:text-gray-400 ml-4">{title}</p>}
          </div>

          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Olá, <span className="font-semibold">{userName}</span>
                </p>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Alternar modo escuro"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 py-3 overflow-x-auto">
              <a
                href="/dashboard"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap"
              >
                📊 Dashboard
              </a>
              <a
                href="/transactions"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap"
              >
                📝 Transações
              </a>
              <a
                href="/accounts"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap"
              >
                💳 Contas
              </a>
              <a
                href="/reports"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap"
              >
                📈 Relatórios
              </a>
              <a
                href="/settings"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap"
              >
                ⚙️ Configurações
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            © 2024 App Financeiro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
