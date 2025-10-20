import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, projectRole, password } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !projectRole || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Connect to database
    const client = await connectDB()
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user object
    const user = {
      firstName,
      lastName,
      email,
      phone,
      projectRole,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      status: 'active'
    }

    // Insert user into database
    const result = await db.collection('users').insertOne(user)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: { ...userWithoutPassword, id: result.insertedId }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}