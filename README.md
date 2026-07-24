# 💰 App Financeiro - Gestão Financeira Pessoal

Um sistema completo e fácil de usar para gerenciar suas finanças pessoais com **sincronização offline** e acesso em qualquer lugar.

## 🎯 Características

- ✅ **Dashboard intuitivo** com resumo de saldos e gráficos
- ✅ **Gestão de contas e carteiras** com saldos em tempo real
- ✅ **Registro de transações** com categorização automática
- ✅ **Modo offline** - funciona sem internet
- ✅ **Sincronização automática** quando retorna online
- ✅ **Relatórios e análises** com gráficos avançados
- ✅ **Orçamentos mensais** com alertas
- ✅ **Exportação de dados** em CSV e PDF
- ✅ **Interface responsiva** - funciona em todos os dispositivos
- ✅ **Segurança** com autenticação JWT

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** com TypeScript
- **Vite** para build rápido
- **Tailwind CSS** para styling
- **IndexedDB** para armazenamento local
- **Service Worker** para offline support
- **Recharts** para gráficos

### Backend
- **Node.js** com Express
- **TypeScript**
- **PostgreSQL / SQLite** para banco de dados
- **JWT** para autenticação
- **Zod** para validação

### DevOps
- **Git** para versionamento
- **ESLint + TypeScript** para qualidade de código

## 📦 Estrutura do Projeto

```
App-Financeiro/
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── services/     # Lógica de negócio
│   │   ├── hooks/        # Custom React hooks
│   │   ├── types/        # TypeScript interfaces
│   │   └── App.tsx
│   ├── public/           # Arquivos estáticos
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Node.js + Express
│   ├── src/
│   │   ├── routes/       # Endpoints da API
│   │   ├── controllers/  # Lógica dos endpoints
│   │   ├── services/     # Regras de negócio
│   │   ├── models/       # Schemas do banco
│   │   ├── middleware/   # Autenticação, validação
│   │   ├── db/           # Conexão e migrations
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── database/             # Scripts SQL
│   └── schema.sql
│
└── README.md
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- PostgreSQL (opcional - pode usar SQLite para desenvolvimento)

### Instalação

1. **Clone/acesse o repositório**
```bash
cd "C:\Aplicativos\App financeiro"
```

2. **Instale dependências do frontend**
```bash
cd frontend
npm install
```

3. **Instale dependências do backend**
```bash
cd ../backend
npm install
```

4. **Configure variáveis de ambiente**
```bash
# Backend
cp .env.example .env
# Edite .env com suas configurações
```

5. **Configure o banco de dados**
```bash
npm run migrate
```

### Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Acesse em: http://localhost:5173

## 📚 Documentação

- [Frontend Setup](./frontend/README.md) - Configuração detalhada do React
- [Backend Setup](./backend/README.md) - Configuração detalhada do Express
- [Database Schema](./database/README.md) - Estrutura do banco de dados
- [API Docs](./backend/API.md) - Documentação de endpoints

## 🔄 Sincronização Offline

O app funciona completamente offline:
- Dados são salvos localmente em IndexedDB
- Service Worker intercepta requisições de rede
- Quando volta online, sincroniza automaticamente
- Conflitos são resolvidos com timestamp

## 🔐 Segurança

- Senhas hash com bcrypt
- JWT para autenticação
- Validação de dados com Zod
- CORS configurado
- Variáveis sensíveis em .env

## 📊 Próximas Funcionalidades

- [ ] Suporte a múltiplas moedas
- [ ] Integração com bancos
- [ ] IA para categorização automática
- [ ] Notificações push
- [ ] App mobile nativa

## 🤝 Contribuindo

Sinta-se livre para:
1. Fork o projeto
2. Criar sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 👤 Autor

Criado com ❤️ para você gerenciar suas finanças de forma simples e eficiente.

---

**Última atualização:** Julho 2026
