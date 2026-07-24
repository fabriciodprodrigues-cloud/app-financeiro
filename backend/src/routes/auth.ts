import { Router, Request, Response } from 'express'
import { userService } from '../services/user.service'
import { validateBody } from '../middleware/validation'
import { createUserSchema, loginSchema } from '../models/schemas'

const router = Router()

// Register
router.post('/register', validateBody(createUserSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const result = await userService.createUser({ email, password, name })

    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to register',
      },
    })
  }
})

// Login
router.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await userService.createUser({ email, password, name: email.split('@')[0] })

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: error instanceof Error ? error.message : 'Invalid credentials',
      },
    })
  }
})

export default router
