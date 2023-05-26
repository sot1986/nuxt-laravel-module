import { z } from 'zod'

const NameSchema = z.string().max(255)
const EmailSchema = z.string({
  required_error: 'Email is required',
}).min(1, { message: 'Email is required' }).email(
  { message: 'Not a valid email.' },
).max(255)
const PasswordSchema = z.string({
  required_error: 'Password is required',
}).min(8, { message: 'Password must have at least 8 characters' }).max(50, {
  message: 'Password must have maximum 50 charcaters.',
})
const tokenSchema = z.string()

export const RegisterSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  passwordConfirmation: PasswordSchema,
}).refine(credentials => credentials.password === credentials.passwordConfirmation, {
  message: 'Passwords don\'t match.',
  path: ['passwordConfirmation'],
})

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  remember: z.boolean(),
})

export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
})

export const ResetPasswordSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  passwordConfirmation: PasswordSchema,
  token: tokenSchema,
}).refine(credentials => credentials.password === credentials.passwordConfirmation, {
  message: 'Passwords don\'t match.',
  path: ['passwordConfirmation'],
})

export const ResendEmailVerificationSchema = z.object({
  email: EmailSchema,
})

export const ConfirmPasswordSchema = z.object({
  password: PasswordSchema,
})
