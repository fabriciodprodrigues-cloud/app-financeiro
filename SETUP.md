# 🚀 Setup Completo - App Financeiro

Guia passo-a-passo para configurar o projeto completamente.

## ✅ Checklist de Instalação

### 1. Pré-requisitos

- [ ] Node.js 18+ instalado
  ```bash
  node --version  # v18.0.0 ou superior
  ```

- [ ] npm ou yarn
  ```bash
  npm --version
  ```

- [ ] Git instalado
  ```bash
  git --version
  ```

- [ ] PostgreSQL (opcional para desenvolvimento)
  - Ou use SQLite para testes rápidos

### 2. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
echo "VITE_API_URL=http://localhost:3000/api" > .env.local

# Verificar tudo está OK
npm run type-check
```

### 3. Configurar Backend

```bash
cd ../backend

# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
# Se usar PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/app_financeiro_db
# Se usar SQLite:
# DATABASE_URL=sqlite:./app.db

# Gerar uma chave JWT segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiar saída para JWT_SECRET em .env

# Verificar configuração
npm run type-check
```

### 4. Configurar Banco de Dados

**Opção A: PostgreSQL**

```bash
# Criar banco de dados
createdb app_financeiro_db

# Executar schema
psql -U seu_usuario -d app_financeiro_db -f ../database/schema.sql

# Testar conexão
psql -U seu_usuario -d app_financeiro_db -c "SELECT version();"
```

**Opção B: SQLite (mais fácil para desenvolvimento)**

```bash
cd backend
npm install sqlite sqlite3

# O banco será criado automaticamente na primeira execução
```

### 5. Iniciar Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Você verá: "Server: http://localhost:3000"
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Você verá: "Local: http://localhost:5173"
```

### 6. Testar

Abra no navegador: http://localhost:5173

Você deve ver a página inicial do App Financeiro com status "Online" no canto superior direito.

## 🔧 Configuração Avançada

### VSCode Extensions Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens"
  ]
}
```

### Prettier + ESLint

```bash
# Frontend
npm install --save-dev prettier eslint-config-prettier

# Backend
npm install --save-dev prettier eslint-config-prettier

# Criar .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF
```

### Git Hooks (Husky)

```bash
# Instalar Husky
npm install husky --save-dev
npx husky install

# Criar pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

## 📁 Estrutura de Pastas Final

```
App-Financeiro/
├── .git/                  # Repositório git
├── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── db.ts
│   │   │   └── sync.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── db/
│   │   └── server.ts
│   ├── dist/             # Build output (criar com npm run build)
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── database/
│   ├── schema.sql
│   └── migrations/       # Adicionar conforme necessário
├── .claude/
│   └── settings.json
├── README.md
├── SETUP.md
└── CONTRIBUTING.md
```

## 🐛 Troubleshooting

### Problema: "Port 3000 already in use"

```bash
# Linux/Mac
sudo lsof -i :3000
kill -9 <PID>

# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: "Cannot find module"

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problema: Database connection error

```bash
# Verificar variável DATABASE_URL
cat backend/.env

# Testar conexão PostgreSQL
psql $DATABASE_URL

# Se estiver vazio, criar arquivo .env
cp backend/.env.example backend/.env
```

### Problema: Service Worker não funciona

```bash
# Limpar cache do navegador
# DevTools → Application → Service Workers → Unregister
# DevTools → Application → Storage → Clear site data

# Recarregar a página
```

## 📚 Próximos Passos

1. **Implementar Autenticação**
   - [ ] Tela de login/registro
   - [ ] Validação de JWT
   - [ ] Refresh token

2. **Core Features**
   - [ ] CRUD de transações
   - [ ] Gestão de contas
   - [ ] Dashboard com gráficos

3. **Sincronização Offline**
   - [ ] IndexedDB setup
   - [ ] Service Worker
   - [ ] Sync queue

4. **Melhorias**
   - [ ] Testes (Jest, Vitest)
   - [ ] Performance
   - [ ] Segurança
   - [ ] CI/CD

## 🤝 Suporte

- 📖 Veja os READMEs de cada pasta
- 🐛 Reporte issues no GitHub
- 💬 Deixe uma mensagem

## 📝 Notas Importantes

- **Nunca commit .env** - Use `.env.example`
- **Change JWT_SECRET** - Gere uma chave segura
- **Backup do banco** - Faça backups regularmente
- **Versioning** - Use semantic versioning para releases

---

**Parabéns! 🎉 Seu ambiente está pronto para desenvolvimento!**
