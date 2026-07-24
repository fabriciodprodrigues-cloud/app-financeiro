import { z } from 'zod'

// User Schemas
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Account Schemas
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Nome da conta é obrigatório'),
  type: z.enum(['checking', 'savings', 'investment', 'credit']),
  balance: z.number().nonnegative('Saldo não pode ser negativo'),
  currency: z.string().default('BRL'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida').default('#0ea5e9'),
})

export const updateAccountSchema = createAccountSchema.partial()

// Transaction Schemas
export const createTransactionSchema = z.object({
  accountId: z.string().uuid('ID da conta inválido'),
  categoryId: z.string().uuid('ID da categoria inválido'),
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  date: z.string().datetime('Data inválida'),
  tags: z.array(z.string()).optional(),
  receipt: z.string().optional(),
})

export const updateTransactionSchema = createTransactionSchema.partial()

// Category Schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório'),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida').default('#9333ea'),
  icon: z.string().default('📁'),
})

export const updateCategorySchema = createCategorySchema.partial()

// Budget Schemas
export const createBudgetSchema = z.object({
  categoryId: z.string().uuid('ID da categoria inválido'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Mês deve estar no formato YYYY-MM'),
  limit: z.number().positive('Limite deve ser positivo'),
  alert: z.boolean().default(true),
})

export const updateBudgetSchema = createBudgetSchema.partial()

// Sync Schemas
export const syncRequestSchema = z.object({
  changes: z.array(z.object({
    type: z.enum(['create', 'update', 'delete']),
    entity: z.enum(['transaction', 'account', 'category']),
    data: z.unknown(),
    timestamp: z.string().datetime(),
  })),
  lastSync: z.string().datetime().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>
export type SyncRequest = z.infer<typeof syncRequestSchema>
