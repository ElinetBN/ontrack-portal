// models/TenderApplication.js
import mongoose from 'mongoose';

const tenderApplicationSchema = new mongoose.Schema({
  // Tender Reference
  tender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: [true, 'Tender reference is required']
  },
  
  // Application Metadata - MAKE applicationNumber NOT REQUIRED initially
  applicationNumber: {
    type: String,
    unique: true,
    sparse: true // This allows multiple null values but enforces uniqueness for non-null values
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'evaluated', 'awarded', 'rejected'],
    default: 'submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },

  // Company Information
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      trim: true
    },
    taxNumber: {
      type: String,
      required: [true, 'Tax number is required'],
      trim: true
    },
    companyType: {
      type: String,
      required: [true, 'Company type is required'],
      enum: ['pty', 'cc', 'sole', 'partnership', 'other']
    },
    yearEstablished: {
      type: String,
      required: [true, 'Year established is required']
    },
    numberOfEmployees: {
      type: String,
      required: [true, 'Number of employees is required'],
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    physicalAddress: {
      type: String,
      required: [true, 'Physical address is required']
    },
    postalAddress: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    province: {
      type: String,
      required: [true, 'Province is required'],
      enum: [
        'gauteng', 'western-cape', 'kzn', 'eastern-cape', 
        'free-state', 'limpopo', 'mpumalanga', 'north-west', 'northern-cape'
      ]
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required']
    }
  },

  // Contact Information
  contact: {
    person: {
      type: String,
      required: [true, 'Contact person is required']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    alternativeContact: {
      type: String,
      default: ''
    }
  },

  // Proposal Details
  proposal: {
    title: {
      type: String,
      required: [true, 'Proposal title is required']
    },
    executiveSummary: {
      type: String,
      required: [true, 'Executive summary is required']
    },
    technicalProposal: {
      type: String,
      default: ''
    },
    methodology: {
      type: String,
      required: [true, 'Methodology is required']
    },
    workPlan: {
      type: String,
      required: [true, 'Work plan is required']
    },
    teamComposition: {
      type: String,
      required: [true, 'Team composition is required']
    }
  },

  // Financial Proposal
  financial: {
    totalBidAmount: {
      type: Number,
      required: [true, 'Total bid amount is required'],
      min: [0, 'Bid amount cannot be negative']
    },
    breakdown: [{
      item: String,
      description: String,
      quantity: {
        type: Number,
        default: 1
      },
      unitPrice: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      }
    }],
    paymentTerms: {
      type: String,
      required: [true, 'Payment terms are required']
    },
    validityPeriod: {
      type: String,
      default: '90'
    }
  },

  // Compliance Information
  compliance: {
    bbbeeStatus: {
      type: String,
      required: [true, 'B-BBEE status is required'],
      enum: ['exempt', 'qse', 'large', '']
    },
    bbbeeLevel: {
      type: String,
      required: [true, 'B-BBEE level is required'],
      enum: ['1', '2', '3', '4', '5', '6', '7', '8', 'non', '']
    },
    taxCompliance: {
      type: Boolean,
      default: false
    },
    cidbRegistration: {
      type: String,
      default: ''
    },
    cidbGrade: {
      type: String,
      default: ''
    }
  },

  // Documents
  documents: [{
    name: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    url: String,
    description: String
  }],

  // Declarations
  declarations: {
    termsAccepted: {
      type: Boolean,
      required: [true, 'Terms acceptance is required'],
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'You must accept the terms and conditions'
      }
    },
    informationAccurate: {
      type: Boolean,
      required: [true, 'Information accuracy declaration is required'],
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'You must declare that the information is accurate'
      }
    },
    nonCollusion: {
      type: Boolean,
      required: [true, 'Non-collusion declaration is required'],
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'You must accept the non-collusion declaration'
      }
    }
  }

}, {
  timestamps: true
});

// FIXED: Generate application number BEFORE validation
tenderApplicationSchema.pre('validate', function(next) {
  console.log('🔄 Pre-validate hook running for applicationNumber...');
  
  if (this.isNew && !this.applicationNumber) {
    try {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 10).toUpperCase();
      this.applicationNumber = `APP-${timestamp}-${random}`;
      console.log('🔢 Generated application number in pre-validate:', this.applicationNumber);
    } catch (error) {
      console.error('❌ Error generating application number in pre-validate:', error);
      // Create a simple fallback
      this.applicationNumber = `APP-${Date.now()}-FB`;
    }
  }
  next();
});

// Also add pre-save as backup
tenderApplicationSchema.pre('save', function(next) {
  console.log('💾 Pre-save hook running...');
  
  // Double-check applicationNumber exists before saving
  if (!this.applicationNumber) {
    console.log('⚠️  applicationNumber missing in pre-save, generating now...');
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.applicationNumber = `APP-SAVE-${timestamp}-${random}`;
  }
  
  this.lastUpdated = Date.now();
  console.log('✅ Pre-save completed with applicationNumber:', this.applicationNumber);
  next();
});

// Alternative: Use a static method to create with guaranteed applicationNumber
tenderApplicationSchema.statics.createApplication = async function(applicationData) {
  console.log('🎯 Using static createApplication method...');
  
  // Generate application number first
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const applicationNumber = `APP-STATIC-${timestamp}-${random}`;
  
  console.log('🔢 Generated via static method:', applicationNumber);
  
  const application = new this({
    ...applicationData,
    applicationNumber
  });
  
  return await application.save();
};

export default mongoose.models.TenderApplication || mongoose.model('TenderApplication', tenderApplicationSchema);