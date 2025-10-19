import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';
import Tender from '@/models/Tender';

// GET /api/tender-applications - Get all applications (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const tenderId = searchParams.get('tenderId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: any = {};
    
    if (tenderId) {
      filter.tender = tenderId;
    }
    
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const applications = await TenderApplication.find(filter)
      .populate('tender', 'title tenderNumber')
      .populate('company', 'name registrationNumber')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await TenderApplication.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching tender applications:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch tender applications',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/tender-applications - Submit a new tender application
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const applicationData = await request.json();
    
    console.log('Submitting tender application:', applicationData);

    // Validate required fields
    const requiredFields = ['tenderId', 'companyName', 'contactPerson', 'contactEmail', 'totalBidAmount'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Check if tender exists and is still open
    const tender = await Tender.findById(applicationData.tenderId);
    if (!tender) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender not found' 
        },
        { status: 404 }
      );
    }

    if (tender.status !== 'open') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender is no longer accepting applications' 
        },
        { status: 400 }
      );
    }

    // Check if deadline hasn't passed
    if (new Date(tender.closingDate) < new Date()) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender application deadline has passed' 
        },
        { status: 400 }
      );
    }

    // Check for duplicate application (same company for same tender)
    const existingApplication = await TenderApplication.findOne({
      tender: applicationData.tenderId,
      'company.registrationNumber': applicationData.registrationNumber
    });

    if (existingApplication) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Your company has already submitted an application for this tender' 
        },
        { status: 409 }
      );
    }

    // Create the application
    const application = new TenderApplication({
      tender: applicationData.tenderId,
      company: {
        name: applicationData.companyName,
        registrationNumber: applicationData.registrationNumber,
        taxNumber: applicationData.taxNumber,
        companyType: applicationData.companyType,
        yearEstablished: applicationData.yearEstablished,
        numberOfEmployees: applicationData.numberOfEmployees,
        physicalAddress: applicationData.physicalAddress,
        postalAddress: applicationData.postalAddress,
        city: applicationData.city,
        province: applicationData.province,
        postalCode: applicationData.postalCode
      },
      contact: {
        person: applicationData.contactPerson,
        email: applicationData.contactEmail,
        phone: applicationData.contactPhone,
        alternativeContact: applicationData.alternativeContact
      },
      proposal: {
        title: applicationData.proposalTitle,
        executiveSummary: applicationData.executiveSummary,
        technicalProposal: applicationData.technicalProposal,
        methodology: applicationData.methodology,
        workPlan: applicationData.workPlan,
        teamComposition: applicationData.teamComposition
      },
      financial: {
        totalBidAmount: applicationData.totalBidAmount,
        breakdown: applicationData.breakdown,
        paymentTerms: applicationData.paymentTerms,
        validityPeriod: applicationData.validityPeriod
      },
      compliance: {
        bbbeeStatus: applicationData.bbbeeStatus,
        bbbeeLevel: applicationData.bbbeeLevel,
        taxCompliance: applicationData.taxCompliance,
        cidbRegistration: applicationData.cidbRegistration,
        cidbGrade: applicationData.cidbGrade
      },
      documents: applicationData.uploadedDocuments?.map((doc: any) => ({
        name: doc.name,
        type: doc.type,
        size: doc.size,
        uploadedAt: new Date()
      })) || [],
      declarations: {
        termsAccepted: applicationData.termsAccepted,
        informationAccurate: applicationData.informationAccurate,
        nonCollusion: applicationData.nonCollusion
      },
      status: 'submitted',
      submittedAt: new Date(),
      applicationNumber: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    const savedApplication = await application.save();

    // Update tender submissions count
    await Tender.findByIdAndUpdate(applicationData.tenderId, {
      $inc: { submissionsCount: 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Tender application submitted successfully',
      data: {
        id: savedApplication._id,
        applicationNumber: savedApplication.applicationNumber,
        submittedAt: savedApplication.submittedAt
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error submitting tender application:', error);
    
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
        message: 'Failed to submit tender application',
        error: error.message 
      },
      { status: 500 }
    );
  }
}