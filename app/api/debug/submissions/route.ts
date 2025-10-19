import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';

export async function GET() {
  try {
    await connectDB();
    
    console.log('🔍 Debug: Fetching all tender applications from MongoDB...');
    
    // Get all applications with tender populated
    const applications = await TenderApplication.find({})
      .populate('tender', 'title referenceNumber')
      .sort({ submittedAt: -1 })
      .lean();
    
    console.log('📊 Debug: Found applications in MongoDB:', applications.length);
    
    if (applications.length > 0) {
      console.log('📋 Sample application data:', {
        id: applications[0]._id,
        tender: applications[0].tender,
        company: applications[0].company,
        status: applications[0].status,
        applicationNumber: applications[0].applicationNumber
      });
    }
    
    return NextResponse.json({
      success: true,
      data: applications,
      count: applications.length,
      message: `Found ${applications.length} applications in MongoDB`
    });
    
  } catch (error) {
    console.error('❌ Debug: Error fetching applications from MongoDB:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      data: []
    }, { status: 500 });
  }
}