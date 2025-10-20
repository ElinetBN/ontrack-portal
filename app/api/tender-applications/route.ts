// Add this GET method to your existing tender-applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';
import Tender from '@/models/Tender';

// Helper function to format currency
function formatCurrency(amount: number) {
  if (!amount || isNaN(amount)) return 'R 0.00';
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// GET /api/tender-applications - Get all submissions with filtering
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Fetching all tender applications...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    const { searchParams } = new URL(request.url);
    const tenderId = searchParams.get('tenderId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (tenderId && tenderId !== 'all') {
      filter.tender = tenderId;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    console.log('🔍 Filter criteria:', filter);

    // Get submissions with pagination
    const submissions = await TenderApplication.find(filter)
      .populate('tender', 'title description referenceNumber closingDate status')
      .populate('company', 'name registrationNumber taxNumber contactEmail contactPhone')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await TenderApplication.countDocuments(filter);

    console.log(`✅ Found ${submissions.length} submissions out of ${total} total`);

    // Transform the data to match your frontend expectations
    const transformedSubmissions = submissions.map(submission => {
      // Safe data transformation with fallbacks
      const tenderTitle = submission.tender && typeof submission.tender === 'object' 
        ? (submission.tender as any).title 
        : 'Unknown Tender';
      
      const companyName = submission.company && typeof submission.company === 'object'
        ? (submission.company as any).name
        : 'Unknown Company';
      
      const totalBidAmount = submission.financial?.totalBidAmount || 0;
      const bidAmount = formatCurrency(totalBidAmount);

      return {
        _id: submission._id?.toString() || '',
        id: submission._id?.toString() || '',
        tender: submission.tender,
        tenderId: submission.tender && typeof submission.tender === 'object' 
          ? (submission.tender as any)._id?.toString() 
          : submission.tender?.toString() || '',
        company: submission.company,
        companyName: companyName,
        applicationNumber: submission.applicationNumber || '',
        status: submission.status || 'submitted',
        score: submission.score || 0,
        submittedAt: submission.submittedAt || submission.createdAt || new Date().toISOString(),
        lastUpdated: submission.lastUpdated || submission.updatedAt || submission.submittedAt || new Date().toISOString(),
        
        // Contact information
        contact: submission.contact || {},
        contactPerson: submission.contact?.person || '',
        contactEmail: submission.contact?.email || '',
        contactPhone: submission.contact?.phone || '',
        
        // Proposal information
        proposal: submission.proposal || {},
        proposalTitle: submission.proposal?.title || 'No proposal title',
        executiveSummary: submission.proposal?.executiveSummary || '',
        methodology: submission.proposal?.methodology || '',
        workPlan: submission.proposal?.workPlan || '',
        teamComposition: submission.proposal?.teamComposition || '',
        
        // Financial information
        financial: submission.financial || {},
        totalBidAmount: totalBidAmount,
        
        // Compliance information
        compliance: submission.compliance || {},
        bbbeeStatus: submission.compliance?.bbbeeStatus || '',
        bbbeeLevel: submission.compliance?.bbbeeLevel || '',
        taxCompliance: submission.compliance?.taxCompliance || false,
        
        // Documents
        documents: submission.documents || [],
        
        // Notes and evaluation
        notes: submission.notes || '',
        evaluation: submission.evaluation || {},
        
        // Additional fields for frontend
        tenderTitle: tenderTitle,
        supplier: companyName,
        amount: totalBidAmount,
        bidAmount: bidAmount,
        submissionDate: submission.submittedAt || submission.createdAt || new Date().toISOString(),
        submittedDate: submission.submittedAt || submission.createdAt || new Date().toISOString()
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedSubmissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('💥 Error fetching tender applications:', error);
    
    // More detailed error logging
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch tender applications',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
// app/api/tender-applications/route.js
export const dynamic = 'force-dynamic'; // Force dynamic rendering