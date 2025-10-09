// models/Tender.ts - Tender Model
import { Schema, model, models, Document } from 'mongoose';

export interface ITender extends Document {
  tenderNumber: string;
  title: string;
  description?: string;
  organization?: string;
  category?: string;
  value?: number;
  currency: string;
  status: 'open' | 'closed' | 'awarded' | 'cancelled' | 'pending';
  publishDate: Date;
  closingDate: Date;
  location?: string;
  contactPerson?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  documents?: Array<{
    name: string;
    url: string;
    uploadDate: Date;
  }>;
  requirements?: string[];
  tags?: string[];
  metadata?: {
    source?: string;
    externalId?: string;
    lastUpdated: Date;
    createdBy?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TenderSchema = new Schema<ITender>(
  {
    tenderNumber: {
      type: String,
      required: [true, 'Tender number is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    value: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'ZAR',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'awarded', 'cancelled', 'pending'],
      default: 'open',
      lowercase: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    closingDate: {
      type: Date,
      required: [true, 'Closing date is required'],
    },
    location: String,
    contactPerson: {
      name: String,
      email: String,
      phone: String,
    },
    documents: [
      {
        name: String,
        url: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    requirements: [String],
    tags: [String],
    metadata: {
      source: String,
      externalId: String,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      createdBy: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TenderSchema.index({ tenderNumber: 1 });
TenderSchema.index({ status: 1 });
TenderSchema.index({ closingDate: 1 });
TenderSchema.index({ organization: 1 });

export const Tender = models.Tender || model<ITender>('Tender', TenderSchema);