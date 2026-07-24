interface SummaryCardProps {
  title: string
  value: number
  type: 'balance' | 'income' | 'expense' | 'savings'
  icon: string
  trend?: {
    value: number
    isPositive: boolean
  }
  format?: 'currency' | 'percentage'
}

export function SummaryCard({
  title,
  value,
  type,
  icon,
  trend,
  format = 'currency',
}: SummaryCardProps) {
  const formatValue = (val: number) => {
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  const getTypeColor = () => {
    switch (type) {
      case 'income':
        return 'text-success-600'
      case 'expense':
        return 'text-danger-600'
      case 'savings':
        return 'text-primary-600'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'income':
        return 'bg-success-50 dark:bg-success-900/20'
      case 'expense':
        return 'bg-danger-50 dark:bg-danger-900/20'
      case 'savings':
        return 'bg-primary-50 dark:bg-primary-900/20'
      default:
        return 'bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <div className={`card ${getBackgroundColor()}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <h3 className={`text-3xl font-bold ${getTypeColor()}`}>
            {formatValue(value)}
          </h3>

          {trend && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={
                  trend.isPositive
                    ? 'text-success-600'
                    : 'text-danger-600'
                }
              >
                {trend.isPositive ? '📈' : '📉'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}
