import mongoose from 'mongoose';

const tenderApplicationSchema = new mongoose.Schema({
  tender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true
  },
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  company: {
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    taxNumber: { type: String, required: true },
    companyType: { type: String, required: true },
    yearEstablished: { type: String, required: true },
    numberOfEmployees: { type: String, required: true },
    physicalAddress: { type: String, required: true },
    postalAddress: { type: String },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  contact: {
    person: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternativeContact: { type: String }
  },
  proposal: {
    title: { type: String, required: true },
    executiveSummary: { type: String, required: true },
    technicalProposal: { type: String, required: true },
    methodology: { type: String, required: true },
    workPlan: { type: String, required: true },
    teamComposition: { type: String, required: true }
  },
  financial: {
    totalBidAmount: { type: Number, required: true },
    breakdown: [{
      item: String,
      description: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }],
    paymentTerms: String,
    validityPeriod: String
  },
  compliance: {
    bbbeeStatus: String,
    bbbeeLevel: String,
    taxCompliance: Boolean,
    cidbRegistration: String,
    cidbGrade: String
  },
  documents: [{
    name: String,
    fileName: String,
    filePath: String,
    type: String,
    mimeType: String,
    size: Number,
    uploadedAt: Date
  }],
  declarations: {
    termsAccepted: { type: Boolean, required: true },
    informationAccurate: { type: Boolean, required: true },
    nonCollusion: { type: Boolean, required: true }
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
  evaluation: {
    score: Number,
    comments: String,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    evaluatedAt: Date
  }
}, {
  timestamps: true
});

export default mongoose.models.TenderApplication || mongoose.model('TenderApplication', tenderApplicationSchema);