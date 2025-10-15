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

    const tender = await Tender.findById(id);

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
      data: tender
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