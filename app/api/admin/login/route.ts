import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json()

        const adminUser = process.env.ADMIN_USER
        const adminPass = process.env.ADMIN_PASSWORD
        const jwtSecret = process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'

        if (!adminUser || !adminPass) {
            console.error('Admin credentials not configured in .env.local')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        if (username === adminUser && password === adminPass) {
            // Create JWT
            const secret = new TextEncoder().encode(jwtSecret)
            const token = await new SignJWT({ role: 'admin' })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(secret)

            // Create response
            const response = NextResponse.json({ success: true })

            // Set cookie
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            })

            return response
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
