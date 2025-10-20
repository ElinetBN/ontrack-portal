import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface IMetadata {
  source: string;
  lastUpdated: Date;
  createdBy: string;
}

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
  contactPerson: IContactPerson;
  requirements: string[];
  tags: string[];
  metadata: IMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Create interface for static methods (if needed)
export interface ITenderModel extends Model<ITender> {
  // You can add static methods here if needed
  // Example: findByStatus(status: string): Promise<ITender[]>;
}

const ContactPersonSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  }
});

const MetadataSchema: Schema = new Schema({
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
});

const TenderSchema: Schema<ITender> = new Schema({
  tenderNumber: {
    type: String,
    required: [true, 'Tender number is required'],
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Tender title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Tender description is required'],
    trim: true
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    default: 'University Procurement',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'Tender value is required'],
    min: [0, 'Tender value cannot be negative']
  },
  currency: {
    type: String,
    default: 'ZAR',
    uppercase: true,
    enum: {
      values: ['ZAR', 'USD', 'EUR', 'GBP'],
      message: 'Currency must be ZAR, USD, EUR, or GBP'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'closed', 'awarded', 'pending', 'cancelled'],
      message: 'Status must be open, closed, awarded, pending, or cancelled'
    },
    default: 'open'
  },
  publishDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(this: ITender, value: Date) {
        return !this.closingDate || value <= this.closingDate;
      },
      message: 'Publish date must be before or equal to closing date'
    }
  },
  closingDate: {
    type: Date,
    required: [true, 'Closing date is required'],
    validate: {
      validator: function(this: ITender, value: Date) {
        return value > new Date();
      },
      message: 'Closing date must be in the future'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  contactPerson: {
    type: ContactPersonSchema,
    required: [true, 'Contact person information is required']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: MetadataSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days remaining
TenderSchema.virtual('daysRemaining').get(function(this: ITender) {
  const now = new Date();
  const closing = new Date(this.closingDate);
  const diffTime = closing.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for isExpired
TenderSchema.virtual('isExpired').get(function(this: ITender) {
  return new Date() > new Date(this.closingDate);
});

// Indexes for better query performance
TenderSchema.index({ tenderNumber: 1 });
TenderSchema.index({ status: 1 });
TenderSchema.index({ organization: 1 });
TenderSchema.index({ category: 1 });
TenderSchema.index({ closingDate: 1 });
TenderSchema.index({ 'contactPerson.email': 1 });
TenderSchema.index({ tags: 1 });
TenderSchema.index({ value: 1 });

// Compound indexes for common queries
TenderSchema.index({ status: 1, closingDate: 1 });
TenderSchema.index({ category: 1, status: 1 });
TenderSchema.index({ organization: 1, status: 1 });

// Pre-save middleware to update metadata
TenderSchema.pre<ITender>('save', function(next) {
  this.metadata.lastUpdated = new Date();
  next();
});

// Static method example (uncomment if needed)
// TenderSchema.statics.findByStatus = function(status: string): Promise<ITender[]> {
//   return this.find({ status }).sort({ closingDate: 1 }).exec();
// };

// Instance method example (uncomment if needed)
// TenderSchema.methods.getSummary = function(): { title: string; tenderNumber: string; daysRemaining: number } {
//   return {
//     title: this.title,
//     tenderNumber: this.tenderNumber,
//     daysRemaining: this.daysRemaining
//   };
// };

// Export the model with proper typing
const Tender: ITenderModel = (mongoose.models.Tender as ITenderModel) || 
  mongoose.model<ITender, ITenderModel>('Tender', TenderSchema);

export default Tender;