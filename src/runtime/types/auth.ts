import type { z } from 'zod'
import type * as auth from '../schemas/auth'

export type Register = z.infer<typeof auth.RegisterSchema>
export type Login = z.infer<typeof auth.LoginSchema>
export type ForgotPassword = z.infer<typeof auth.ForgotPasswordSchema>
export type ResetPassword = z.infer<typeof auth.ResetPasswordSchema>
export type ResendEmailVerification = z.infer<typeof auth.ResendEmailVerificationSchema>
export type ConfirmPassword = z.infer<typeof auth.ConfirmPasswordSchema>

export {}
