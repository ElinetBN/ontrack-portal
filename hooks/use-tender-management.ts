// hooks/use-tender-management.ts
import { useState, useEffect, useCallback } from 'react';

// Types that match your dashboard's expected structure
export interface Tender {
  id: string;
  title: string;
  department: string;
  status: "Open" | "Closed" | "Evaluation" | "Awarded" | "Draft";
  deadline: string;
  budget: string;
  submissions: number;
  category: string;
  description: string;
  referenceNumber: string;
  requestedItems: string[];
  createdDate: string;
  location: string;
  contractPeriod: string;
  cidbGrading: string;
  bbbeeLevel: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  submissionMethod: string;
  tenderFee: string;
  advertisementLink: string;
  isDraft?: boolean;
  createdBy?: string;
  requiresApproval?: boolean;
}

export interface Submission {
  id: string;
  tenderId: string;
  supplier: string;
  company: string;
  proposal: string;
  amount: number;
  documents: any[];
  status: "submitted" | "under_review" | "evaluated" | "awarded" | "rejected";
  score?: number;
  submittedAt: string;
  evaluation?: any;
  tenderTitle?: string;
  companyName?: string;
  submissionDate?: string;
  lastUpdated?: string;
  bidAmount?: string;
  submittedDate?: string;
  notes?: string;
}

// API Client functions
class TenderAPI {
  private static baseURL = '/api/tenders';

  static async createTender(data: any) {
    console.log('Creating tender:', data);
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create tender: ${response.status}`);
    }

    return response.json();
  }

  static async getTenders(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    organization?: string;
    category?: string;
  }) {
    console.log('Fetching tenders with filters:', filters);
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${this.baseURL}?${params.toString()}`;
    console.log('API URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tenders: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Tenders API response:', result);
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  static async getTenderById(id: string) {
    const response = await fetch(`${this.baseURL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch tender');
    return response.json();
  }

  static async updateTender(id: string, data: Partial<any>) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update tender');
    }

    return response.json();
  }

  static async deleteTender(id: string) {
    try {
      console.log('Deleting tender with ID:', id);
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `Failed to delete tender: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.log('Response is not JSON, using status text');
        }
        
        throw new Error(errorMessage);
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        console.log('Delete successful (no content returned)');
        return { success: true, message: 'Tender deleted successfully' };
      }

      try {
        const result = await response.json();
        console.log('Delete response JSON:', result);
        return result;
      } catch (jsonError) {
        console.log('No JSON response for delete, returning success');
        return { success: true, message: 'Tender deleted successfully' };
      }
    } catch (error) {
      console.error('Error in deleteTender:', error);
      throw error;
    }
  }
}

// Helper function to safely extract numeric value from budget string
const extractBudgetValue = (budget: string | number | undefined | null): number => {
  if (typeof budget === 'number') {
    return budget;
  }
  
  if (!budget) {
    return 0;
  }
  
  try {
    const numericString = budget.toString().replace(/[^0-9]/g, '');
    return parseInt(numericString) || 0;
  } catch (error) {
    console.warn('Error parsing budget:', budget, error);
    return 0;
  }
};

// Helper function to format budget with currency
const formatBudget = (value: number | string | undefined | null, currency: string = 'ZAR'): string => {
  const numericValue = typeof value === 'number' ? value : extractBudgetValue(value);
  return `${currency} ${numericValue?.toLocaleString() || '0'}`;
};

// Helper function to safely extract contact person name
const extractContactPerson = (contactPerson: any): string => {
  if (typeof contactPerson === 'string') {
    return contactPerson;
  }
  
  if (contactPerson && typeof contactPerson === 'object') {
    return contactPerson.name || contactPerson.fullName || '';
  }
  
  return '';
};

// Helper function to safely extract contact email
const extractContactEmail = (contactPerson: any): string => {
  if (typeof contactPerson === 'string') {
    return '';
  }
  
  if (contactPerson && typeof contactPerson === 'object') {
    return contactPerson.email || '';
  }
  
  return '';
};

// Helper function to safely extract contact phone
const extractContactPhone = (contactPerson: any): string => {
  if (typeof contactPerson === 'string') {
    return '';
  }
  
  if (contactPerson && typeof contactPerson === 'object') {
    return contactPerson.phone || contactPerson.phoneNumber || '';
  }
  
  return '';
};

// Helper function to map API tender data to your dashboard format
const mapApiTenderToDashboard = (apiTender: any): Tender => {
  // Map API status to your dashboard status
  const statusMap: { [key: string]: "Open" | "Closed" | "Evaluation" | "Awarded" | "Draft" } = {
    'open': 'Open',
    'closed': 'Closed',
    'awarded': 'Awarded',
    'pending': 'Draft',
    'cancelled': 'Closed',
    'draft': 'Draft'
  };

  // Safely handle budget value
  const budgetValue = apiTender.value || apiTender.budget || 0;
  const formattedBudget = formatBudget(budgetValue, apiTender.currency);

  // Safely extract contact information
  const contactPerson = extractContactPerson(apiTender.contactPerson);
  const contactEmail = extractContactEmail(apiTender.contactPerson) || apiTender.contactEmail || '';
  const contactPhone = extractContactPhone(apiTender.contactPerson) || apiTender.contactPhone || '';

  return {
    id: apiTender._id || apiTender.id || `temp-${Date.now()}`,
    title: apiTender.title || 'Untitled Tender',
    department: apiTender.organization || apiTender.department || 'General',
    status: statusMap[apiTender.status] || 'Draft',
    deadline: apiTender.closingDate || apiTender.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: formattedBudget,
    submissions: apiTender.submissions || 0,
    category: apiTender.category || 'General',
    description: apiTender.description || '',
    referenceNumber: apiTender.tenderNumber || apiTender.referenceNumber || `TND-${Date.now()}`,
    requestedItems: apiTender.requirements || apiTender.requestedItems || [],
    createdDate: apiTender.createdAt || apiTender.publishDate || apiTender.createdDate || new Date().toISOString(),
    location: apiTender.location || '',
    contractPeriod: apiTender.contractPeriod || '',
    cidbGrading: apiTender.cidbGrading || '',
    bbbeeLevel: apiTender.bbbeeLevel || '',
    contactPerson: contactPerson,
    contactEmail: contactEmail,
    contactPhone: contactPhone,
    submissionMethod: apiTender.submissionMethod || 'online',
    tenderFee: apiTender.tenderFee || 'No fee',
    advertisementLink: apiTender.advertisementLink || `https://example.gov.za/tenders/${apiTender.tenderNumber || apiTender._id || apiTender.id}`,
    isDraft: apiTender.status === 'draft' || apiTender.status === 'pending' || apiTender.isDraft === true,
    createdBy: apiTender.createdBy,
    requiresApproval: apiTender.requiresApproval
  };
};

// Helper function to map dashboard tender to API format
const mapDashboardTenderToApi = (tender: Tender): any => {
  const statusMap: { [key: string]: string } = {
    'Open': 'open',
    'Closed': 'closed',
    'Awarded': 'awarded',
    'Draft': 'draft',
    'Evaluation': 'open'
  };

  // Safely extract numeric value from budget string
  const budgetValue = extractBudgetValue(tender.budget);

  return {
    title: tender.title || 'Untitled Tender',
    description: tender.description || '',
    organization: tender.department || 'General',
    category: tender.category || 'General',
    value: budgetValue,
    currency: 'ZAR',
    status: statusMap[tender.status] || 'draft',
    closingDate: tender.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: tender.location || '',
    tenderNumber: tender.referenceNumber || `TND-${Date.now()}`,
    requirements: tender.requestedItems || [],
    contractPeriod: tender.contractPeriod || '',
    cidbGrading: tender.cidbGrading || '',
    bbbeeLevel: tender.bbbeeLevel || '',
    contactPerson: {
      name: tender.contactPerson || '',
      email: tender.contactEmail || '',
      phone: tender.contactPhone || ''
    },
    submissionMethod: tender.submissionMethod || 'online',
    tenderFee: tender.tenderFee || 'No fee',
    advertisementLink: tender.advertisementLink || ''
  };
};

// Mock submissions data
const mockSubmissions: Submission[] = [
  {
    id: '1',
    tenderId: '1',
    supplier: 'ABC Construction',
    company: 'ABC Construction Ltd',
    companyName: 'ABC Construction Ltd',
    proposal: 'Comprehensive maintenance proposal',
    amount: 150000,
    bidAmount: 'R 150,000',
    documents: [],
    status: 'under_review',
    score: 85,
    submittedAt: new Date('2024-01-15').toISOString(),
    submissionDate: new Date('2024-01-15').toISOString(),
    submittedDate: new Date('2024-01-15').toISOString(),
    lastUpdated: new Date('2024-01-15').toISOString(),
    tenderTitle: 'Road Maintenance Contract'
  },
  {
    id: '2',
    tenderId: '1',
    supplier: 'XYZ Services',
    company: 'XYZ Services Pty Ltd',
    companyName: 'XYZ Services Pty Ltd',
    proposal: 'Alternative maintenance approach',
    amount: 120000,
    bidAmount: 'R 120,000',
    documents: [],
    status: 'submitted',
    submittedAt: new Date('2024-01-10').toISOString(),
    submissionDate: new Date('2024-01-10').toISOString(),
    submittedDate: new Date('2024-01-10').toISOString(),
    lastUpdated: new Date('2024-01-10').toISOString(),
    tenderTitle: 'Road Maintenance Contract'
  },
  {
    id: '3',
    tenderId: '2',
    supplier: 'Tech Solutions Inc',
    company: 'Tech Solutions Inc',
    companyName: 'Tech Solutions Inc',
    proposal: 'IT infrastructure upgrade proposal',
    amount: 250000,
    bidAmount: 'R 250,000',
    documents: [],
    status: 'under_review',
    score: 92,
    submittedAt: new Date('2024-01-20').toISOString(),
    submissionDate: new Date('2024-01-20').toISOString(),
    submittedDate: new Date('2024-01-20').toISOString(),
    lastUpdated: new Date('2024-01-20').toISOString(),
    tenderTitle: 'IT Equipment Supply'
  }
];

// Mock initial tenders data
const mockTenders: Tender[] = [
  {
    id: '1',
    title: 'Road Maintenance Contract',
    department: 'Public Works',
    status: 'Open',
    deadline: '2024-12-31',
    budget: 'R 5,000,000',
    submissions: 2,
    category: 'Construction',
    description: 'Annual road maintenance and repair services for municipal roads',
    referenceNumber: 'PW-2024-001',
    requestedItems: ['Asphalt', 'Road marking', 'Drainage maintenance'],
    createdDate: '2024-01-15',
    location: 'City Wide',
    contractPeriod: '12 months',
    cidbGrading: '7CE',
    bbbeeLevel: 'Level 2',
    contactPerson: 'John Smith',
    contactEmail: 'john.smith@publicworks.gov.za',
    contactPhone: '+27 11 123 4567',
    submissionMethod: 'Online Portal',
    tenderFee: 'No fee',
    advertisementLink: 'https://example.gov.za/tenders/PW-2024-001',
    isDraft: false
  },
  {
    id: '2',
    title: 'IT Equipment Supply',
    department: 'ICT',
    status: 'Open',
    deadline: '2024-11-30',
    budget: 'R 2,500,000',
    submissions: 1,
    category: 'Technology',
    description: 'Supply of computers, servers and network equipment for government offices',
    referenceNumber: 'ICT-2024-002',
    requestedItems: ['Laptops', 'Servers', 'Network Equipment'],
    createdDate: '2024-01-10',
    location: 'Head Office',
    contractPeriod: '6 months',
    cidbGrading: 'N/A',
    bbbeeLevel: 'Level 1',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@ict.gov.za',
    contactPhone: '+27 11 234 5678',
    submissionMethod: 'Email Submission',
    tenderFee: 'R 500',
    advertisementLink: 'https://example.gov.za/tenders/ICT-2024-002',
    isDraft: false
  },
  {
    id: '3',
    title: 'Office Cleaning Services',
    department: 'Facilities Management',
    status: 'Draft',
    deadline: '2024-10-15',
    budget: 'R 800,000',
    submissions: 0,
    category: 'Services',
    description: 'Daily cleaning services for government building complex',
    referenceNumber: 'FM-2024-003',
    requestedItems: ['Cleaning equipment', 'Sanitary supplies', 'Staff uniforms'],
    createdDate: '2024-01-20',
    location: 'Government Complex',
    contractPeriod: '24 months',
    cidbGrading: '1GB',
    bbbeeLevel: 'Level 4',
    contactPerson: 'Mike Brown',
    contactEmail: 'mike.brown@facilities.gov.za',
    contactPhone: '+27 11 345 6789',
    submissionMethod: 'Online Portal',
    tenderFee: 'No fee',
    advertisementLink: '',
    isDraft: true
  }
];

export function useTenderManagement(initialTenders: Tender[] = mockTenders, initialSubmissions: Submission[] = mockSubmissions) {
  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tenders from API on mount
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting data fetch...');
      
      // Try to fetch tenders from API first
      try {
        const tenderResponse = await TenderAPI.getTenders({ limit: 100 });
        console.log('Tender response received:', tenderResponse);
        
        if (tenderResponse.success && tenderResponse.data) {
          // Map API data to your dashboard format
          const mappedTenders = tenderResponse.data.map((apiTender: any) => 
            mapApiTenderToDashboard(apiTender)
          );
          console.log('Mapped tenders:', mappedTenders);
          setTenders(mappedTenders);
        } else {
          console.warn('Tender API response indicates failure, using mock data');
          setTenders(initialTenders);
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError);
        setTenders(initialTenders);
      }

      // Use mock submissions
      console.log('Using mock submissions data');
      setSubmissions(mockSubmissions);

    } catch (err: any) {
      console.error('Error in fetchData:', err);
      setError(err.message || 'Failed to load data from server');
      setTenders(initialTenders);
      setSubmissions(initialSubmissions);
    } finally {
      console.log('Data fetch completed, setting loading to false');
      setLoading(false);
    }
  }, [initialTenders, initialSubmissions]);

  useEffect(() => {
    console.log('useTenderManagement hook mounted');
    fetchData();
  }, [fetchData]);

  const handleTenderCreate = useCallback(async (tenderData: any) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure tenderData has all required fields with defaults
      const completeTenderData = {
        ...tenderData,
        budget: tenderData.budget || 'R 0',
        submissions: 0,
        createdDate: new Date().toISOString(),
        status: tenderData.status || 'Draft',
        contactPerson: typeof tenderData.contactPerson === 'object' ? tenderData.contactPerson.name : tenderData.contactPerson || '',
        contactEmail: typeof tenderData.contactPerson === 'object' ? tenderData.contactPerson.email : tenderData.contactEmail || '',
        contactPhone: typeof tenderData.contactPerson === 'object' ? tenderData.contactPerson.phone : tenderData.contactPhone || ''
      };

      // Prepare data for API
      const apiTenderData = mapDashboardTenderToApi(completeTenderData);

      console.log('Creating tender with data:', apiTenderData);
      
      try {
        const response = await TenderAPI.createTender(apiTenderData);
        
        if (response.success) {
          const newTender = mapApiTenderToDashboard(response.data);
          setTenders(prev => [newTender, ...prev]);
          return newTender;
        } else {
          throw new Error(response.message || 'Failed to create tender');
        }
      } catch (apiError) {
        console.warn('API create failed, creating locally:', apiError);
        // Create tender locally if API fails
        const newTender: Tender = {
          id: Date.now().toString(),
          ...completeTenderData
        };
        setTenders(prev => [newTender, ...prev]);
        return newTender;
      }
    } catch (err: any) {
      console.error('Error in handleTenderCreate:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTenderUpdate = useCallback(async (tenderId: string, updatedData: Partial<Tender>) => {
    try {
      setError(null);

      // Ensure contact fields are properly handled
      const safeUpdatedData = {
        ...updatedData,
        budget: updatedData.budget || 'R 0',
        contactPerson: typeof updatedData.contactPerson === 'object' ? (updatedData.contactPerson as any).name : updatedData.contactPerson || '',
        contactEmail: typeof updatedData.contactPerson === 'object' ? (updatedData.contactPerson as any).email : updatedData.contactEmail || '',
        contactPhone: typeof updatedData.contactPerson === 'object' ? (updatedData.contactPerson as any).phone : updatedData.contactPhone || ''
      };

      const apiData = mapDashboardTenderToApi(safeUpdatedData as Tender);
      
      try {
        const response = await TenderAPI.updateTender(tenderId, apiData);

        if (response.success) {
          setTenders(prev =>
            prev.map(tender =>
              tender.id === tenderId
                ? { ...tender, ...safeUpdatedData }
                : tender
            )
          );
          return response.data;
        }
      } catch (apiError) {
        console.warn('API update failed, updating locally:', apiError);
        setTenders(prev =>
          prev.map(tender =>
            tender.id === tenderId
              ? { ...tender, ...safeUpdatedData }
              : tender
          )
        );
        return { success: true, message: 'Tender updated locally' };
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleTenderDelete = useCallback(async (tenderId: string) => {
    try {
      setError(null);
      console.log('Deleting tender:', tenderId);

      try {
        const response = await TenderAPI.deleteTender(tenderId);
        console.log('Delete API response:', response);
      } catch (apiError) {
        console.warn('API delete failed, deleting locally:', apiError);
      }

      // Always update local state regardless of API response
      setTenders(prev => prev.filter(tender => tender.id !== tenderId));
      setSubmissions(prev => prev.filter(submission => submission.tenderId !== tenderId));
      
      return { success: true, message: 'Tender deleted successfully' };
      
    } catch (err: any) {
      console.error('Error in handleTenderDelete:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const handleTenderStatusChange = useCallback(async (tenderId: string, newStatus: string) => {
    try {
      setError(null);

      const statusMap: { [key: string]: string } = {
        'Open': 'open',
        'Closed': 'closed',
        'Awarded': 'awarded',
        'Draft': 'draft',
        'Evaluation': 'open'
      };

      const apiStatus = statusMap[newStatus] || newStatus.toLowerCase();

      try {
        const response = await TenderAPI.updateTender(tenderId, { 
          status: apiStatus,
          metadata: {
            lastUpdated: new Date()
          }
        });

        if (response.success) {
          setTenders(prev =>
            prev.map(tender =>
              tender.id === tenderId
                ? { 
                    ...tender, 
                    status: newStatus as any
                  }
                : tender
            )
          );
          return response.data;
        }
      } catch (apiError) {
        console.warn('API status change failed, updating locally:', apiError);
        setTenders(prev =>
          prev.map(tender =>
            tender.id === tenderId
              ? { 
                  ...tender, 
                  status: newStatus as any
                }
              : tender
          )
        );
        return { success: true, message: 'Status updated locally' };
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleTenderPublish = useCallback(async (tenderId: string) => {
    try {
      setError(null);
      
      try {
        const response = await TenderAPI.updateTender(tenderId, { 
          status: 'open',
          publishDate: new Date(),
          metadata: {
            lastUpdated: new Date(),
            published: true
          }
        });

        if (response.success) {
          setTenders(prev =>
            prev.map(tender =>
              tender.id === tenderId
                ? { 
                    ...tender, 
                    status: 'Open' as const,
                    isDraft: false
                  }
                : tender
            )
          );
          return response.data;
        }
      } catch (apiError) {
        console.warn('API publish failed, publishing locally:', apiError);
        setTenders(prev =>
          prev.map(tender =>
            tender.id === tenderId
              ? { 
                  ...tender, 
                  status: 'Open' as const,
                  isDraft: false
                }
              : tender
          )
        );
        return { success: true, message: 'Tender published locally' };
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleDocumentsUpdate = useCallback(async (submissionId: string, documents: any[]) => {
    try {
      setError(null);
      setSubmissions(prev =>
        prev.map(submission =>
          submission.id === submissionId
            ? { ...submission, documents }
            : submission
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleEvaluationComplete = useCallback(async (submissionId: string, score: number, status: string) => {
    try {
      setError(null);

      setSubmissions(prev =>
        prev.map(submission =>
          submission.id === submissionId
            ? { 
                ...submission, 
                score,
                status: status as any
              }
            : submission
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const refreshTenders = useCallback(async () => {
    console.log('Manual refresh triggered');
    await fetchData();
  }, [fetchData]);

  console.log('Hook state - Loading:', loading, 'Tenders:', tenders.length, 'Submissions:', submissions.length, 'Error:', error);

  return {
    // State
    tenders,
    submissions,
    loading,
    error,
    
    // Tender operations
    handleTenderCreate,
    handleTenderUpdate,
    handleTenderDelete,
    handleTenderStatusChange,
    handleTenderPublish,
    refreshTenders,
    
    // Submission operations
    handleDocumentsUpdate,
    handleEvaluationComplete,
  };
}