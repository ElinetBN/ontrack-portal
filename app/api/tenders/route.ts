// app/api/tenders/route.ts - GET and POST handlers
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Tender } from '@/models/Tender';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const organization = searchParams.get('organization');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = {};

    if (status) query.status = status;
    if (organization) query.organization = new RegExp(organization, 'i');
    if (category) query.category = new RegExp(category, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tenderNumber: new RegExp(search, 'i') },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const tenders = await Tender.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Tender.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: tenders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching tenders:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching tenders',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Check if tender number already exists
    const existingTender = await Tender.findOne({ 
      tenderNumber: body.tenderNumber 
    });

    if (existingTender) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tender with this number already exists',
          tenderNumber: body.tenderNumber,
        },
        { status: 409 }
      );
    }

    const tender = new Tender(body);
    await tender.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Tender created successfully',
        data: tender,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating tender:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating tender',
        error: error.message,
      },
      { status: 400 }
    );
  }
}