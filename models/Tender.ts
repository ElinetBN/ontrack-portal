import mongoose, { Schema, Document } from 'mongoose';

export interface ITender extends Document {
  tenderNumber: string;
  title: string;
  description: string;
  organization: string;
  category: string;
  value: number;
  currency: string;
  status: 'open' | 'closed' | 'awarded' | 'pending' | 'cancelled';
  publishDate: Date;
  closingDate: Date;
  location: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  requirements: string[];
  tags: string[];
  metadata: {
    source: string;
    lastUpdated: Date;
    createdBy: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TenderSchema: Schema = new Schema({
  tenderNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true,
    default: 'University Procurement'
  },
  category: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ZAR'
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'awarded', 'pending', 'cancelled'],
    default: 'open'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  closingDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  requirements: [String],
  tags: [String],
  metadata: {
    source: {
      type: String,
      default: 'web-portal'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      default: 'system-user'
    }
  }
}, {
  timestamps: true
});

// Create index for better search performance
TenderSchema.index({ tenderNumber: 1 });
TenderSchema.index({ status: 1 });
TenderSchema.index({ organization: 1 });
TenderSchema.index({ category: 1 });
TenderSchema.index({ closingDate: 1 });

export default mongoose.models.Tender || mongoose.model<ITender>('Tender', TenderSchema);