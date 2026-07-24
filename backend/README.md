# Backend - App Financeiro

API REST para gerenciamento de finanças pessoais, construída com Node.js, Express e TypeScript.

## 🛠️ Tecnologias

- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Autenticação
- **Zod** - Validação
- **bcryptjs** - Hash de senhas

## 📁 Estrutura

```
backend/
├── src/
│   ├── routes/           # Definição de endpoints
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── accounts.routes.ts
│   │   ├── transactions.routes.ts
│   │   ├── categories.routes.ts
│   │   ├── budgets.routes.ts
│   │   └── sync.routes.ts
│   ├── controllers/      # Lógica dos endpoints
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── accounts.controller.ts
│   │   ├── transactions.controller.ts
│   │   ├── categories.controller.ts
│   │   ├── budgets.controller.ts
│   │   └── sync.controller.ts
│   ├── services/         # Regras de negócio
│   │   ├── user.service.ts
│   │   ├── account.service.ts
│   │   ├── transaction.service.ts
│   │   ├── category.service.ts
│   │   ├── budget.service.ts
│   │   └── sync.service.ts
│   ├── models/           # Schemas e tipos
│   │   └── schemas.ts
│   ├── middleware/       # Autenticação, validação, etc
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── db/               # Conexão e migrations
│   │   ├── connection.ts
│   │   ├── migrate.ts
│   │   └── seed.ts
│   └── server.ts         # Entry point
├── .env.example          # Exemplo de variáveis de ambiente
├── tsconfig.json         # Configuração TypeScript
└── package.json
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
# (banco de dados, JWT_SECRET, etc)

# Executar migrations
npm run migrate

# Iniciar servidor
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

`.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/app_financeiro_db
DATABASE_TYPE=postgres

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Encryption
ENCRYPTION_KEY=your_encryption_key
```

## 📡 API Endpoints

### Autenticação

```
POST   /api/auth/register    # Criar conta
POST   /api/auth/login       # Fazer login
POST   /api/auth/refresh     # Renovar token
POST   /api/auth/logout      # Logout
```

### Usuários

```
GET    /api/users/me         # Perfil do usuário
PUT    /api/users/me         # Atualizar perfil
DELETE /api/users/me         # Deletar conta
```

### Contas

```
GET    /api/accounts         # Listar contas
POST   /api/accounts         # Criar conta
GET    /api/accounts/:id     # Detalhes da conta
PUT    /api/accounts/:id     # Atualizar conta
DELETE /api/accounts/:id     # Deletar conta
```

### Transações

```
GET    /api/transactions              # Listar transações
POST   /api/transactions              # Criar transação
GET    /api/transactions/:id          # Detalhes
PUT    /api/transactions/:id          # Atualizar
DELETE /api/transactions/:id          # Deletar
GET    /api/transactions/stats/month  # Estatísticas do mês
```

### Categorias

```
GET    /api/categories       # Listar categorias
POST   /api/categories       # Criar categoria
PUT    /api/categories/:id   # Atualizar
DELETE /api/categories/:id   # Deletar
```

### Orçamentos

```
GET    /api/budgets          # Listar orçamentos
POST   /api/budgets          # Criar orçamento
PUT    /api/budgets/:id      # Atualizar
DELETE /api/budgets/:id      # Deletar
```

### Sincronização

```
POST   /api/sync             # Sincronizar dados offline
GET    /api/sync/status      # Status da sincronização
```

## 🔐 Autenticação

### Fluxo de Login

1. Cliente envia email e senha
2. Backend valida credenciais
3. Retorna JWT token e refresh token
4. Cliente armazena tokens no localStorage
5. Envia JWT em cada requisição: `Authorization: Bearer <token>`

### Middlewares

```typescript
// Proteger rota
router.get('/protected', authMiddleware, controller)

// Validar dados
router.post('/data', validateBody(schema), controller)
```

## 💾 Database

### Schema

Veja [database/schema.sql](../database/schema.sql) para a estrutura completa.

### Migrations

```bash
# Executar migrations
npm run migrate

# Seed dados de teste
npm run seed
```

## 🔄 Sincronização Offline

Tabela `sync_queue` rastreia mudanças offline:

```typescript
POST /api/sync
{
  changes: [
    {
      type: 'create',
      entity: 'transaction',
      data: { ... },
      timestamp: '2024-01-15T10:30:00Z'
    }
  ],
  lastSync: '2024-01-15T10:00:00Z'
}
```

Response:

```typescript
{
  success: true,
  synced: 5,
  conflicts: [],
  lastSync: '2024-01-15T10:35:00Z'
}
```

## 🧪 Testes

```bash
# Rodar testes
npm run test

# Cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📊 Logs

O backend registra:
- Requisições HTTP
- Erros
- Mudanças no banco de dados
- Sincronização de dados

```typescript
console.log('POST /api/transactions', { userId, amount })
console.error('Database error:', error)
```

## 🚨 Tratamento de Erros

Respostas padronizadas:

```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Email is required'
  }
}
```

## 🔒 Segurança

- ✅ Senhas com bcrypt
- ✅ JWT com expiração
- ✅ CORS configurado
- ✅ Validação com Zod
- ✅ Rate limiting (implementar)
- ✅ SQL injection protection (prepared statements)

## 🐛 Debugging

### Logs de Debug

```bash
DEBUG=app:* npm run dev
```

### Database Debugging

```bash
# Conectar ao PostgreSQL
psql -U user -d app_financeiro_db

# Ver transações
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
```

## 📚 Recursos Úteis

- [Express Docs](https://expressjs.com)
- [PostgreSQL](https://www.postgresql.org/docs)
- [JWT.io](https://jwt.io)
- [Zod](https://zod.dev)

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Faça commit de suas mudanças
3. Push para a branch
4. Abra um Pull Request

## 📄 Licença

MIT License
