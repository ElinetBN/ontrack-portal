// app/api/tenders/[id]/route.ts - GET, PUT, PATCH, DELETE by ID
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Tender } from '@/models/Tender';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const tender = await Tender.findById(params.id);

    if (!tender) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tender not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tender,
    });
  } catch (error: any) {
    console.error('Error fetching tender:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching tender',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const tender = await Tender.findByIdAndUpdate(
      params.id,
      {
        ...body,
        'metadata.lastUpdated': new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!tender) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tender not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tender updated successfully',
      data: tender,
    });
  } catch (error: any) {
    console.error('Error updating tender:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating tender',
        error: error.message,
      },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const tender = await Tender.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...body,
          'metadata.lastUpdated': new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!tender) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tender not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tender updated successfully',
      data: tender,
    });
  } catch (error: any) {
    console.error('Error updating tender:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating tender',
        error: error.message,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const tender = await Tender.findByIdAndDelete(params.id);

    if (!tender) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tender not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tender deleted successfully',
      data: tender,
    });
  } catch (error: any) {
    console.error('Error deleting tender:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting tender',
        error: error.message,
      },
      { status: 500 }
    );
  }
}