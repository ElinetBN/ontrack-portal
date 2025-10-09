// app/api/tenders/stats/route.ts - Statistics
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Tender } from '@/models/Tender';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const stats = await Tender.aggregate([
      {
        $facet: {
          statusCount: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          totalValue: [{ $group: { _id: null, total: { $sum: '$value' } } }],
          categoryCount: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          recentTenders: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                title: 1,
                tenderNumber: 1,
                status: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const total = await Tender.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        total,
        ...stats[0],
      },
    });
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching statistics',
        error: error.message,
      },
      { status: 500 }
    );
  }
}