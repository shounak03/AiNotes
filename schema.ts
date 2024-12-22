import * as z from 'zod'

export const User = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    username: z.string(),
})