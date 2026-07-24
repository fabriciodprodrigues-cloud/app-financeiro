import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

// Initialize Express
const app = express()

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Simple in-memory user storage for demo
const users = new Map<string, any>()

// Helper function to generate JWT
const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'secret_key_demo',
    { expiresIn: process.env.JWT_EXPIRATION || '7d' } as any
  )
}

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email, password, and name are required' },
      })
      return
    }

    if (users.has(email)) {
      res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' },
      })
      return
    }

    const userId = `user_${Date.now()}`
    const user = { id: userId, email, name, createdAt: new Date() }

    users.set(email, { ...user, password })

    const token = generateToken(userId, email)

    res.status(201).json({
      success: true,
      data: { user, token },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'REGISTRATION_ERROR', message: error instanceof Error ? error.message : 'Registration failed' },
    })
  }
})

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required' },
      })
      return
    }

    const user = users.get(email)

    if (!user || user.password !== password) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      })
      return
    }

    const token = generateToken(user.id, email)

    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      },
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'LOGIN_ERROR', message: error instanceof Error ? error.message : 'Login failed' },
    })
  }
})

app.get('/api/users/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_demo') as any
    const user = Array.from(users.values()).find(u => u.email === decoded.email)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ id: user.id, email: user.email, name: user.name })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  })
})

// API Routes (to be implemented)
app.get('/api/status', (_req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : 'An error occurred',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║     🚀 App Financeiro Backend         ║
  ║     Version: 1.0.0                    ║
  ║     Environment: ${NODE_ENV.padEnd(21)}║
  ║     Server: http://localhost:${PORT}        ║
  ╚════════════════════════════════════════╝
  `)
})

export default app
