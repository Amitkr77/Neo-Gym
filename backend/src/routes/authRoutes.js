import express from 'express'
import { signup, login } from '../controllers/authController.js'
import { rateLimit } from '../middleware/validate.js'

const router = express.Router()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: () => Number(process.env.LOGIN_RATE_LIMIT) || 10,
    message: 'Too many login attempts. Please wait 15 minutes and try again.',
})
const signupLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: () => Number(process.env.SIGNUP_RATE_LIMIT) || 20 })

router.post('/signup', signupLimiter, signup)
router.post('/login', loginLimiter, login)

export default router
