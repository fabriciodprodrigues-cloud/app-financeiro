# 🚀 Quick Start - App Financeiro

Guia rápido para iniciar o projeto em desenvolvimento.

## ✅ Pré-Requisitos

- ✅ Node.js 18+ instalado
- ✅ npm instalado
- ✅ Dependências já instaladas

## 🎯 Iniciar os Servidores

### Terminal 1 - Backend (API)

```bash
cd C:\Aplicativos\App financeiro\backend
npm run dev
```

**Saída esperada:**
```
🚀 App Financeiro Backend
Version: 1.0.0
Environment: development
Server: http://localhost:3000
```

### Terminal 2 - Frontend (Interface)

```bash
cd C:\Aplicativos\App financeiro\frontend
npm run dev
```

**Saída esperada:**
```
  VITE v5.0.0  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 🌐 Acessar a Aplicação

Abra seu navegador em: **http://localhost:5173**

Você verá a página de login! 🎉

## 📝 Dados de Teste

Para testar o login, use qualquer email/senha (o backend ainda não valida):

```
Email: teste@example.com
Senha: senha123
```

Ou crie uma nova conta clicando em "Criar Conta".

## 🎮 Explorar a Interface

1. **Login/Registro** - Crie uma conta ou faça login
2. **Dashboard** - Veja o resumo financeiro
3. **Dark Mode** - Clique no botão 🌙 no header
4. **Logout** - Clique em "Sair"

## 🔧 Funcionalidades Disponíveis

✅ Autenticação (login/registro)  
✅ Dashboard com dados mock  
✅ Dark mode completo  
✅ Layout responsivo  
✅ API client pronto  
✅ Armazenamento local (IndexedDB)  

## 🛠️ Parar os Servidores

Pressione `Ctrl + C` em cada terminal.

## 📊 Próxima Etapa

Quando estiver pronto, implemente:
- CRUD de Transações
- Gestão de Contas
- Gráficos e Relatórios

## 🆘 Se Tiver Problemas

### Backend não inicia?
```bash
# Verifique se a porta 3000 está livre
netstat -ano | findstr :3000

# Verifique as dependências
npm install
```

### Frontend não carrega?
```bash
# Limpe o cache
npm run build

# Verifique se a porta 5173 está livre
netstat -ano | findstr :5173
```

### Erro de compilação?
```bash
# Verifique tipos
npm run type-check

# Limpe node_modules
rm -r node_modules package-lock.json
npm install
```

## 📚 Documentação

- [README.md](./README.md) - Visão geral do projeto
- [SETUP.md](./SETUP.md) - Instalação detalhada
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Status e roadmap
- [TEMPLATE_STATUS.md](./TEMPLATE_STATUS.md) - Componentes criados
- [frontend/README.md](./frontend/README.md) - Frontend específico
- [backend/README.md](./backend/README.md) - Backend específico

## 🎉 Bom desenvolvimento!

Enjoy building! 💻✨
