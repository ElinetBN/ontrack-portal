import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tender from '@/models/Tender';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/tenders/[id] - Get a specific tender
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const { id } = params;
    
    console.log('Fetching tender with ID:', id);

    const tender = await Tender.findById(id)
      .populate('createdBy', 'name email')
      .populate('organization', 'name department')
      .exec();

    if (!tender) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender not found' 
        },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend expected format
    const tenderData = {
      id: tender._id.toString(),
      title: tender.title,
      description: tender.description,
      status: tender.status,
      budget: tender.value || tender.budget,
      deadline: tender.closingDate,
      submissions: tender.submissionsCount || 0,
      category: tender.category,
      publishedDate: tender.publishDate || tender.createdAt,
      requirements: tender.requirements || [],
      contactPerson: tender.contactPerson || {
        name: tender.contactName || '',
        email: tender.contactEmail || '',
        phone: tender.contactPhone || '',
        department: tender.department || ''
      },
      contactEmail: tender.contactEmail,
      documents: tender.documents || [],
      evaluationCriteria: tender.evaluationCriteria || [],
      termsAndConditions: tender.termsAndConditions || [],
      scopeOfWork: tender.scopeOfWork,
      bidBondRequired: tender.bidBondRequired || false,
      bidBondAmount: tender.bidBondAmount || 0,
      preBidMeeting: tender.preBidMeeting,
      siteVisitRequired: tender.siteVisitRequired || false,
      siteVisitDate: tender.siteVisitDate,
      // Additional fields for bidder application
      referenceNumber: tender.tenderNumber,
      department: tender.organization?.name || tender.department,
      location: tender.location,
      contractPeriod: tender.contractPeriod,
      cidbGrading: tender.cidbGrading,
      bbbeeLevel: tender.bbbeeLevel,
      submissionMethod: tender.submissionMethod,
      tenderFee: tender.tenderFee,
      advertisementLink: tender.advertisementLink,
      bidderApplicationLink: tender.bidderApplicationLink,
      requestedItems: tender.requirements || [],
      createdDate: tender.createdAt,
      isDraft: tender.status === 'draft'
    };

    return NextResponse.json({
      success: true,
      data: tenderData
    });

  } catch (error: any) {
    console.error('Error fetching tender:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch tender',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PATCH /api/tenders/[id] - Update a tender
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const { id } = params;
    const updateData = await request.json();

    console.log('Updating tender:', id, 'with data:', updateData);

    // Add metadata update
    const updatedData = {
      ...updateData,
      'metadata.lastUpdated': new Date()
    };

    const tender = await Tender.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!tender) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tender updated successfully',
      data: tender
    });

  } catch (error: any) {
    console.error('Error updating tender:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update tender',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tenders/[id] - Delete a tender
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const { id } = params;

    console.log('Deleting tender:', id);

    const tender = await Tender.findByIdAndDelete(id);

    if (!tender) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tender deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting tender:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete tender',
        error: error.message 
      },
      { status: 500 }
    );
  }
}