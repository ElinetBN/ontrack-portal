// app/api/tenders/bulk/route.ts - Bulk operations
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Tender } from '@/models/Tender';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { tenders } = await request.json();

    if (!Array.isArray(tenders)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Request body must contain a "tenders" array',
        },
        { status: 400 }
      );
    }

    const results = {
      created: [] as any[],
      failed: [] as any[],
      skipped: [] as any[],
    };

    for (const tenderData of tenders) {
      try {
        const existingTender = await Tender.findOne({
          tenderNumber: tenderData.tenderNumber,
        });

        if (existingTender) {
          results.skipped.push({
            tenderNumber: tenderData.tenderNumber,
            reason: 'Already exists',
          });
          continue;
        }

        const tender = new Tender(tenderData);
        await tender.save();
        results.created.push(tender);
      } catch (error: any) {
        results.failed.push({
          tenderNumber: tenderData.tenderNumber,
          error: error.message,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bulk operation completed',
        summary: {
          total: tenders.length,
          created: results.created.length,
          failed: results.failed.length,
          skipped: results.skipped.length,
        },
        results,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in bulk create:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing bulk create',
        error: error.message,
      },
      { status: 500 }
    );
  }
}