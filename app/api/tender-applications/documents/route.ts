import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST /api/tender-applications/documents - Upload documents for a tender application
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tenderId = formData.get('tenderId') as string;
    const applicationId = formData.get('applicationId') as string;
    const documentType = formData.get('documentType') as string || 'supporting';

    if (!file || !tenderId || !applicationId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: file, tenderId, applicationId' 
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File size exceeds 10MB limit' 
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid file type. Allowed types: PDF, DOC, DOCX, JPEG, PNG' 
        },
        { status: 400 }
      );
    }

    // Check if application exists and belongs to the tender
    const application = await TenderApplication.findOne({
      _id: applicationId,
      tender: tenderId
    });

    if (!application) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Application not found or does not belong to the specified tender' 
        },
        { status: 404 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'tender-applications');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.log('Uploads directory already exists or cannot be created');
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);

    // Create document record
    const document = {
      name: file.name,
      fileName: fileName,
      filePath: `/uploads/tender-applications/${fileName}`,
      type: documentType,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date()
    };

    // Add document to application
    application.documents.push(document);
    await application.save();

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documentId: document.fileName,
        name: document.name,
        type: document.type,
        size: document.size,
        uploadedAt: document.uploadedAt
      }
    });

  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload document',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// GET /api/tender-applications/documents - Get application documents
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const tenderId = searchParams.get('tenderId');

    if (!applicationId || !tenderId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing applicationId or tenderId' 
        },
        { status: 400 }
      );
    }

    const application = await TenderApplication.findOne({
      _id: applicationId,
      tender: tenderId
    }).select('documents');

    if (!application) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Application not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application.documents
    });

  } catch (error: any) {
    console.error('Error fetching application documents:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch application documents',
        error: error.message 
      },
      { status: 500 }
    );
  }
}