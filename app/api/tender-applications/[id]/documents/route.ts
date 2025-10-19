// app/api/tender-applications/[id]/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';

// PUT /api/tender-applications/[id]/documents - Update submission documents
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 Updating documents for application:', params.id);
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    const { documents } = await request.json();
    
    console.log('📝 Documents update received:', documents?.length, 'documents');

    const updatedSubmission = await TenderApplication.findByIdAndUpdate(
      params.id,
      { 
        $set: { 
          documents,
          lastUpdated: new Date()
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubmission) {
      console.log('❌ Submission not found for documents update:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender application not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Documents updated successfully:', {
      id: updatedSubmission._id,
      applicationNumber: updatedSubmission.applicationNumber,
      documentCount: updatedSubmission.documents?.length
    });

    return NextResponse.json({
      success: true,
      message: 'Documents updated successfully',
      data: updatedSubmission
    });

  } catch (error: any) {
    console.error('💥 Error updating documents:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update documents',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PATCH /api/tender-applications/[id]/documents/[docId] - Update specific document
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('docId');
    
    console.log('🚀 Updating document:', documentId, 'for application:', params.id);
    
    if (!documentId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Document ID is required' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Document name is required' 
        },
        { status: 400 }
      );
    }

    const updatedSubmission = await TenderApplication.findOneAndUpdate(
      { 
        _id: params.id,
        'documents._id': documentId 
      },
      { 
        $set: { 
          'documents.$.name': name,
          lastUpdated: new Date()
        } 
      },
      { new: true }
    );

    if (!updatedSubmission) {
      console.log('❌ Document or submission not found:', { submissionId: params.id, documentId });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Document or submission not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Document name updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      data: updatedSubmission
    });

  } catch (error: any) {
    console.error('💥 Error updating document:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update document',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tender-applications/[id]/documents/[docId] - Delete specific document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('docId');
    
    console.log('🚀 Deleting document:', documentId, 'from application:', params.id);
    
    if (!documentId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Document ID is required' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    const updatedSubmission = await TenderApplication.findByIdAndUpdate(
      params.id,
      { 
        $pull: { 
          documents: { _id: documentId } 
        },
        $set: {
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    if (!updatedSubmission) {
      console.log('❌ Submission not found for document deletion:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender application not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Document deleted successfully:', {
      id: updatedSubmission._id,
      applicationNumber: updatedSubmission.applicationNumber,
      remainingDocuments: updatedSubmission.documents?.length
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
      data: updatedSubmission
    });

  } catch (error: any) {
    console.error('💥 Error deleting document:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete document',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}