import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET ortam değişkeni tanımlanmamış')
const SECRET = JWT_SECRET as string

export interface JWTPayload {
  userId: string
  username: string
  role: 'admin' | 'customer'
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth(role?: 'admin' | 'customer') {
  const session = await getSession()
  if (!session) return null
  if (role && session.role !== role) return null
  return session
}

export async function getUserFromSession() {
  const session = await getSession()
  if (!session) return null
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { card: true },
  })
}
