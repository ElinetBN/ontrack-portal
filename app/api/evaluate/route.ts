// app/api/submissions/evaluate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const { submissionId, score, status, comments, evaluatedAt } = await request.json()

    // Validate required fields
    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    if (score === undefined || score === null) {
      return NextResponse.json(
        { success: false, error: 'Score is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate score range
    if (score < 0 || score > 100) {
      return NextResponse.json(
        { success: false, error: 'Score must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['submitted', 'under_review', 'evaluated', 'awarded', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    console.log('Submitting evaluation:', {
      submissionId,
      score,
      status,
      comments: comments ? `${comments.substring(0, 50)}...` : 'No comments',
      evaluatedAt
    })

    // Connect to MongoDB
    const db = await connectDB()
    
    // Update submission in database
    const result = await db.connection.db.collection('submissions').updateOne(
      { _id: new ObjectId(submissionId) },
      { 
        $set: { 
          score: parseInt(score),
          status: status,
          'evaluation.comments': comments,
          'evaluation.evaluatedAt': evaluatedAt || new Date().toISOString(),
          'evaluation.evaluatedBy': 'current-user-id', // You can replace this with actual user context
          lastUpdated: new Date().toISOString()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Log successful evaluation
    console.log(`✅ Evaluation submitted for submission ${submissionId}:`, {
      score: `${score}%`,
      status,
      hasComments: !!comments,
      modifiedCount: result.modifiedCount
    })

    return NextResponse.json({
      success: true,
      message: 'Evaluation submitted successfully',
      data: {
        submissionId,
        score,
        status,
        comments,
        evaluatedAt: evaluatedAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        modifiedCount: result.modifiedCount
      }
    })

  } catch (error) {
    console.error('Error in evaluation submission:', error)
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.name === 'CastError') {
        return NextResponse.json(
          { success: false, error: 'Invalid submission ID format' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit evaluation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submissionId')

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const db = await connectDB()
    
    // Fetch submission data from database
    const submissionData = await db.connection.db.collection('submissions').findOne(
      { _id: new ObjectId(submissionId) },
      {
        projection: {
          score: 1,
          status: 1,
          evaluation: 1,
          lastUpdated: 1,
          createdAt: 1
        }
      }
    )

    if (!submissionData) {
      return NextResponse.json(
        { success: false, error: 'Evaluation data not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...submissionData,
        _id: submissionData._id.toString()
      }
    })

  } catch (error) {
    console.error('Error fetching evaluation data:', error)
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.name === 'CastError') {
        return NextResponse.json(
          { success: false, error: 'Invalid submission ID format' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch evaluation data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}