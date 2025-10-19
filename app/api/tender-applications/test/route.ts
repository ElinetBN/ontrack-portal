import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';

export async function GET() {
  try {
    console.log('🧪 Testing tender applications connection...');
    
    await connectDB();
    console.log('✅ Database connected for test');
    
    // Simple count query to test connection
    const count = await TenderApplication.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Tender applications API is working',
      count: count,
      status: 'OK'
    });
    
  } catch (error: any) {
    console.error('💥 Test endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}