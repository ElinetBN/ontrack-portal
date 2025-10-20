import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

     const client = await connectDB()
    const db = client.db()

    // Find user by email
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      portal: user.projectRole
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret)

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        id: user._id.toString()
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}