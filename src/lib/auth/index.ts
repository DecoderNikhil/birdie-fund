import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}
const jwtSecret = JWT_SECRET as string

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, jwtSecret) as JWTPayload
}

export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string | null
  role: string
  created_at: Date
}

export async function createUser(email: string, password: string, fullName?: string): Promise<User> {
  const passwordHash = await hashPassword(password)
  
  const result = await sql`
    INSERT INTO users (email, password_hash, full_name)
    VALUES (${email}, ${passwordHash}, ${fullName})
    RETURNING id, email, password_hash, full_name, created_at
  `
  
  const user = result.rows[0] as any
  
  await sql`
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (${user.id}, ${email}, ${fullName}, 'subscriber')
  `
  
  return {
    id: user.id,
    email: user.email,
    password_hash: user.password_hash,
    full_name: user.full_name,
    role: 'subscriber',
    created_at: user.created_at,
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await sql`
    SELECT u.id, u.email, u.password_hash, u.full_name, u.created_at, p.role
    FROM users u
    JOIN profiles p ON u.id = p.id
    WHERE u.email = ${email}
  `
  
  if (result.rows.length === 0) return null
  
  const user = result.rows[0] as any
  const valid = await verifyPassword(password, user.password_hash)
  
  if (!valid) return null
  
  return {
    id: user.id,
    email: user.email,
    password_hash: user.password_hash,
    full_name: user.full_name,
    role: user.role,
    created_at: user.created_at,
  }
}

export async function getUserById(userId: string) {
  const result = await sql`
    SELECT u.id, u.email, u.full_name, u.created_at, p.role
    FROM users u
    JOIN profiles p ON u.id = p.id
    WHERE u.id = ${userId}
  `
  
  if (result.rows.length === 0) return null
  
  return result.rows[0] as {
    id: string
    email: string
    full_name: string | null
    role: string
    created_at: Date
  }
}
