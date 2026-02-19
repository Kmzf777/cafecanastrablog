import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const getSecret = () =>
  new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'
  )

export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value

  if (!token) return false

  try {
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'
    )
    await jwtVerify(token, secret)
    return true
  } catch (error) {
    return false
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
}
