// app/api/tender-applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';
import Tender from '@/models/Tender';

// Utility function to generate application number
function generateApplicationNumber() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `APP-${timestamp}-${random}`;
}

// POST /api/tender-applications - Submit a new tender application
export async function POST(request: NextRequest) {
  let savedApplication;
  
  try {
    console.log('🚀 Starting tender application submission process...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    const applicationData = await request.json();
    
    console.log('📝 Received application data:', {
      tenderId: applicationData.tenderId,
      companyName: applicationData.companyName,
      contactPerson: applicationData.contactPerson,
      totalBidAmount: applicationData.totalBidAmount
    });

    // Validate required fields
    const requiredFields = [
      'tenderId', 
      'companyName', 
      'registrationNumber', 
      'taxNumber', 
      'companyType',
      'yearEstablished',
      'numberOfEmployees',
      'contactPerson', 
      'contactEmail', 
      'contactPhone',
      'physicalAddress',
      'city',
      'province',
      'postalCode',
      'proposalTitle',
      'executiveSummary',
      'methodology',
      'workPlan',
      'teamComposition',
      'totalBidAmount', 
      'paymentTerms',
      'bbbeeStatus',
      'bbbeeLevel',
      'termsAccepted',
      'informationAccurate',
      'nonCollusion'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = applicationData[field];
      return value === undefined || value === null || value === '' || (typeof value === 'boolean' && !value);
    });
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing or invalid required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Check if tender exists and is still open
    const tender = await Tender.findById(applicationData.tenderId);
    if (!tender) {
      console.log('❌ Tender not found:', applicationData.tenderId);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender not found' 
        },
        { status: 404 }
      );
    }

    if (tender.status !== 'open') {
      console.log('❌ Tender not open for applications. Status:', tender.status);
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
      console.log('❌ Tender deadline has passed:', tender.closingDate);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender application deadline has passed' 
        },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const existingApplication = await TenderApplication.findOne({
      tender: applicationData.tenderId,
      'company.registrationNumber': applicationData.registrationNumber
    });

    if (existingApplication) {
      console.log('❌ Duplicate application found for company:', applicationData.registrationNumber);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Your company has already submitted an application for this tender' 
        },
        { status: 409 }
      );
    }

    // Prepare the application data for saving to database
    const applicationPayload = {
      tender: applicationData.tenderId,
      company: {
        name: applicationData.companyName,
        registrationNumber: applicationData.registrationNumber,
        taxNumber: applicationData.taxNumber,
        companyType: applicationData.companyType,
        yearEstablished: applicationData.yearEstablished,
        numberOfEmployees: applicationData.numberOfEmployees,
        physicalAddress: applicationData.physicalAddress,
        postalAddress: applicationData.postalAddress || applicationData.physicalAddress,
        city: applicationData.city,
        province: applicationData.province,
        postalCode: applicationData.postalCode
      },
      contact: {
        person: applicationData.contactPerson,
        email: applicationData.contactEmail,
        phone: applicationData.contactPhone,
        alternativeContact: applicationData.alternativeContact || ''
      },
      proposal: {
        title: applicationData.proposalTitle,
        executiveSummary: applicationData.executiveSummary,
        technicalProposal: applicationData.technicalProposal || applicationData.methodology || 'Technical proposal details provided',
        methodology: applicationData.methodology,
        workPlan: applicationData.workPlan,
        teamComposition: applicationData.teamComposition
      },
      financial: {
        totalBidAmount: parseFloat(applicationData.totalBidAmount) || 0,
        breakdown: applicationData.breakdown || [],
        paymentTerms: applicationData.paymentTerms,
        validityPeriod: applicationData.validityPeriod || '90'
      },
      compliance: {
        bbbeeStatus: applicationData.bbbeeStatus,
        bbbeeLevel: applicationData.bbbeeLevel,
        taxCompliance: applicationData.taxCompliance || false,
        cidbRegistration: applicationData.cidbRegistration || '',
        cidbGrade: applicationData.cidbGrade || ''
      },
      documents: (applicationData.uploadedDocuments || []).map((doc: any) => ({
        name: doc.name,
        type: doc.type,
        size: doc.size,
        uploadedAt: new Date()
      })),
      declarations: {
        termsAccepted: applicationData.termsAccepted,
        informationAccurate: applicationData.informationAccurate,
        nonCollusion: applicationData.nonCollusion
      },
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        submittedFrom: 'web-portal'
      }
    };

    console.log('💾 Preparing to save application to database...');

    // STRATEGY 1: Try using the static method first
    console.log('🎯 Attempting Strategy 1: Using static createApplication method...');
    try {
      savedApplication = await TenderApplication.createApplication(applicationPayload);
      console.log('✅ Strategy 1 SUCCESS - Application saved via static method');
    } catch (staticError) {
      console.log('❌ Strategy 1 FAILED:', staticError.message);
      
      // STRATEGY 2: Manually create with pre-generated applicationNumber
      console.log('🎯 Attempting Strategy 2: Manual creation with pre-generated applicationNumber...');
      try {
        const manualApplicationNumber = generateApplicationNumber();
        console.log('🔢 Manually generated applicationNumber:', manualApplicationNumber);
        
        const application = new TenderApplication({
          ...applicationPayload,
          applicationNumber: manualApplicationNumber
        });
        
        savedApplication = await application.save();
        console.log('✅ Strategy 2 SUCCESS - Application saved with manual applicationNumber');
      } catch (manualError) {
        console.log('❌ Strategy 2 FAILED:', manualError.message);
        
        // STRATEGY 3: Last resort - create without applicationNumber and update
        console.log('🎯 Attempting Strategy 3: Create without applicationNumber then update...');
        try {
          // Create without applicationNumber first
          const tempApplication = new TenderApplication(applicationPayload);
          // Remove applicationNumber to avoid validation error
          tempApplication.applicationNumber = undefined;
          
          let tempSaved = await tempApplication.save();
          console.log('📝 Temporary save successful, now updating with applicationNumber...');
          
          // Now update with applicationNumber
          const finalApplicationNumber = generateApplicationNumber();
          savedApplication = await TenderApplication.findByIdAndUpdate(
            tempSaved._id,
            { applicationNumber: finalApplicationNumber },
            { new: true }
          );
          console.log('✅ Strategy 3 SUCCESS - Application saved and updated with applicationNumber');
        } catch (finalError) {
          console.log('💥 ALL STRATEGIES FAILED:', finalError);
          throw finalError;
        }
      }
    }

    console.log('✅ Application saved successfully to database:', {
      id: savedApplication._id,
      applicationNumber: savedApplication.applicationNumber,
      databaseId: savedApplication._id.toString()
    });

    // Update tender submissions count
    console.log('🔄 Updating tender submissions count...');
    await Tender.findByIdAndUpdate(applicationData.tenderId, {
      $inc: { submissionsCount: 1 }
    });
    
    console.log('✅ Tender submissions count updated');

    // Return success response
    console.log('🎉 Application submission process completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Tender application submitted successfully and saved to database',
      data: {
        id: savedApplication._id,
        applicationNumber: savedApplication.applicationNumber,
        submittedAt: savedApplication.submittedAt,
        databaseRecord: {
          id: savedApplication._id.toString(),
          createdAt: savedApplication.createdAt,
          updatedAt: savedApplication.updatedAt
        }
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('💥 Error submitting tender application:', error);
    
    // Log additional details about the saved application if it exists
    if (savedApplication) {
      console.error('📄 Application was created but save failed:', {
        id: savedApplication._id,
        applicationNumber: savedApplication.applicationNumber
      });
    }
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      console.log('❌ Validation errors:', validationErrors);
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Application validation failed',
          errors: validationErrors 
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log('❌ Duplicate key error:', error.keyValue);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Application with this reference already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit tender application to database',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}