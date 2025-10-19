// app/api/tender-applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';
import Tender from '@/models/Tender';

// GET /api/tender-applications/[id] - Get single submission by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 Fetching tender application by ID:', params.id);
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Find the submission by ID and populate related data
    const submission = await TenderApplication.findById(params.id)
      .populate('tender', 'title description referenceNumber closingDate status')
      .populate('company', 'name registrationNumber taxNumber contactEmail contactPhone')
      .lean();

    if (!submission) {
      console.log('❌ Submission not found:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender application not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Submission found:', {
      id: submission._id,
      applicationNumber: submission.applicationNumber,
      status: submission.status
    });

    // Transform the data to match your frontend expectations
    const transformedSubmission = {
      _id: submission._id,
      id: submission._id,
      tender: submission.tender,
      tenderId: submission.tender?._id || submission.tender,
      company: submission.company,
      companyName: submission.company?.name || submission.companyName,
      applicationNumber: submission.applicationNumber,
      status: submission.status,
      score: submission.score,
      submittedAt: submission.submittedAt,
      lastUpdated: submission.lastUpdated || submission.updatedAt,
      
      // Contact information
      contact: submission.contact,
      contactPerson: submission.contact?.person,
      contactEmail: submission.contact?.email,
      contactPhone: submission.contact?.phone,
      
      // Proposal information
      proposal: submission.proposal,
      proposalTitle: submission.proposal?.title,
      executiveSummary: submission.proposal?.executiveSummary,
      methodology: submission.proposal?.methodology,
      workPlan: submission.proposal?.workPlan,
      teamComposition: submission.proposal?.teamComposition,
      
      // Financial information
      financial: submission.financial,
      totalBidAmount: submission.financial?.totalBidAmount,
      
      // Compliance information
      compliance: submission.compliance,
      bbbeeStatus: submission.compliance?.bbbeeStatus,
      bbbeeLevel: submission.compliance?.bbbeeLevel,
      taxCompliance: submission.compliance?.taxCompliance,
      
      // Documents
      documents: submission.documents || [],
      
      // Notes and evaluation
      notes: submission.notes,
      evaluation: submission.evaluation,
      
      // Company details from the application
      companyRegistration: submission.company?.registrationNumber,
      taxNumber: submission.company?.taxNumber,
      companyType: submission.company?.companyType,
      yearEstablished: submission.company?.yearEstablished,
      numberOfEmployees: submission.company?.numberOfEmployees,
      physicalAddress: submission.company?.physicalAddress,
      city: submission.company?.city,
      province: submission.company?.province,
      postalCode: submission.company?.postalCode
    };

    return NextResponse.json({
      success: true,
      data: transformedSubmission
    });

  } catch (error: any) {
    console.error('💥 Error fetching tender application:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch tender application',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/tender-applications/[id] - Update submission
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 Updating tender application:', params.id);
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    const updateData = await request.json();
    
    console.log('📝 Update data received:', Object.keys(updateData));

    // Remove fields that shouldn't be updated
    const { _id, id, createdAt, submittedAt, applicationNumber, ...safeUpdateData } = updateData;
    
    // Add lastUpdated timestamp
    safeUpdateData.lastUpdated = new Date();

    const updatedSubmission = await TenderApplication.findByIdAndUpdate(
      params.id,
      { $set: safeUpdateData },
      { new: true, runValidators: true }
    )
    .populate('tender', 'title description referenceNumber closingDate status')
    .populate('company', 'name registrationNumber taxNumber contactEmail contactPhone');

    if (!updatedSubmission) {
      console.log('❌ Submission not found for update:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender application not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Submission updated successfully:', {
      id: updatedSubmission._id,
      applicationNumber: updatedSubmission.applicationNumber,
      status: updatedSubmission.status
    });

    return NextResponse.json({
      success: true,
      message: 'Tender application updated successfully',
      data: updatedSubmission
    });

  } catch (error: any) {
    console.error('💥 Error updating tender application:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      console.log('❌ Validation errors:', validationErrors);
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Update validation failed',
          errors: validationErrors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update tender application',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tender-applications/[id] - Delete submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 Deleting tender application:', params.id);
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    const deletedSubmission = await TenderApplication.findByIdAndDelete(params.id);

    if (!deletedSubmission) {
      console.log('❌ Submission not found for deletion:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender application not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Submission deleted successfully:', {
      id: deletedSubmission._id,
      applicationNumber: deletedSubmission.applicationNumber
    });

    // Update tender submissions count
    await Tender.findByIdAndUpdate(deletedSubmission.tender, {
      $inc: { submissionsCount: -1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Tender application deleted successfully'
    });

  } catch (error: any) {
    console.error('💥 Error deleting tender application:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete tender application',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}