import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tender from '@/models/Tender';

// GET /api/tenders - Get all tenders with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const organization = searchParams.get('organization');
    const category = searchParams.get('category');

    // Build filter object
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (organization) {
      filter.organization = { $regex: organization, $options: 'i' };
    }
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tenderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Fetching tenders with filter:', filter);
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get tenders with filters
    const tenders = await Tender.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Tender.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    console.log(`Found ${tenders.length} tenders out of ${total} total`);

    return NextResponse.json({
      success: true,
      data: tenders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching tenders:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch tenders',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/tenders - Create a new tender
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const tenderData = await request.json();
    
    console.log('Received tender data:', tenderData);

    // Validate required fields
    if (!tenderData.title || !tenderData.closingDate) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title and closing date are required' 
        },
        { status: 400 }
      );
    }

    // Generate tender number if not provided
    if (!tenderData.tenderNumber) {
      const timestamp = Date.now();
      tenderData.tenderNumber = `TND-${timestamp}`;
    }

    // Check if tender number already exists
    const existingTender = await Tender.findOne({ 
      tenderNumber: tenderData.tenderNumber 
    });
    
    if (existingTender) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender number already exists' 
        },
        { status: 409 }
      );
    }

    // Create new tender
    const tender = new Tender({
      ...tenderData,
      metadata: {
        ...tenderData.metadata,
        lastUpdated: new Date()
      }
    });

    const savedTender = await tender.save();
    
    console.log('Tender created successfully:', savedTender._id);

    return NextResponse.json({
      success: true,
      message: 'Tender created successfully',
      data: savedTender
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating tender:', error);
    
    // Handle MongoDB validation errors
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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tender number already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create tender',
        error: error.message 
      },
      { status: 500 }
    );
  }
}