# Frontend - App Financeiro

Interface web moderna e responsiva para gestão financeira pessoal, construída com React, TypeScript e Tailwind CSS.

## 🎨 Tecnologias

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS** - Styling
- **Recharts** - Gráficos
- **Dexie** - IndexedDB wrapper
- **Axios** - HTTP client

## 📁 Estrutura

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Dashboard.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   └── Charts.tsx
│   ├── pages/            # Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   ├── AccountsPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/         # Lógica de negócio
│   │   ├── api.ts        # Chamadas HTTP
│   │   ├── db.ts         # IndexedDB
│   │   ├── sync.ts       # Sincronização
│   │   └── auth.ts       # Autenticação
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useAccounts.ts
│   │   └── useSync.ts
│   ├── types/            # Interfaces TypeScript
│   │   └── index.ts
│   ├── App.tsx           # Componente raiz
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── icon-192.png      # App icon
│   └── icon-512.png      # App icon grande
├── index.html            # HTML template
├── vite.config.ts        # Configuração Vite
├── tsconfig.json         # Configuração TypeScript
├── tailwind.config.js    # Configuração Tailwind
├── postcss.config.js     # Configuração PostCSS
└── package.json
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=AppFinanceiro
```

### Tailwind CSS

O Tailwind está pré-configurado com temas de cores personalizadas:

- **Primary**: `#0ea5e9` (azul)
- **Success**: `#10b981` (verde)
- **Danger**: `#ef4444` (vermelho)
- **Warning**: `#f59e0b` (laranja)

## 💾 Sincronização Offline

### IndexedDB

Os dados são armazenados localmente em IndexedDB:

```typescript
import { db } from '@services/db'

// Adicionar transação
await db.transactions.add({
  id: '123',
  accountId: 'acc_1',
  amount: 100,
  description: 'Compra',
  // ...
})

// Buscar transações
const transactions = await db.transactions.toArray()
```

### Service Worker

O Service Worker (`sw.ts`) intercepta requisições e serve dados do cache quando offline:

```typescript
// Registrar no main.tsx
navigator.serviceWorker.register('/sw.js')
```

## 🔐 Autenticação

### Login/Logout

```typescript
import { useAuth } from '@hooks/useAuth'

function LoginComponent() {
  const { login, logout, user } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
  }

  return (
    // JSX
  )
}
```

### Token JWT

O token é armazenado em localStorage e enviado em cada requisição:

```typescript
Authorization: Bearer <token>
```

## 📊 Componentes Principais

### Dashboard

Exibe resumo de finanças:
- Saldo total
- Receitas vs Despesas do mês
- Últimas transações
- Gráficos de tendências

### TransactionForm

Formulário para adicionar/editar transações:
- Validação de campos
- Seleção de conta e categoria
- Suporte a tags
- Anexo de recibos

### Charts

Gráficos com Recharts:
- Gráfico de barras (receitas x despesas)
- Gráfico de pizza (gastos por categoria)
- Gráfico de linha (tendências ao longo do tempo)

## 🎯 Próximos Passos

- [ ] Implementar autenticação completa
- [ ] Integrar API com backend
- [ ] Melhorar formulários
- [ ] Adicionar validações
- [ ] Testes unitários e E2E
- [ ] Otimizações de performance
- [ ] PWA full setup

## 🐛 Debugging

### Browser DevTools

```javascript
// Verificar dados offline
indexedDB.databases().then(dbs => console.log(dbs))

// Limpar cache
caches.keys().then(names => names.forEach(name => caches.delete(name)))
```

### Logs

Ativa logs de debug em desenvolvimento:

```typescript
const DEBUG = import.meta.env.DEV
if (DEBUG) console.log('Debug info...')
```

## 📱 PWA

A aplicação é uma Progressive Web App:

- Instalar na home screen
- Funciona offline
- Ícones e splash screens personalizados
- Sincronização em background

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Dexie.js](https://dexie.org)

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Faça commit de suas mudanças
3. Push para a branch
4. Abra um Pull Request

## 📄 Licença

MIT License
