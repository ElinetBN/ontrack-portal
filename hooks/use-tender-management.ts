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
}

// Helper function to map API tender data to your dashboard format
const mapApiTenderToDashboard = (apiTender: any): Tender => {
  // Map API status to your dashboard status
  const statusMap: { [key: string]: "Open" | "Closed" | "Evaluation" | "Awarded" | "Draft" } = {
    'open': 'Open',
    'closed': 'Closed',
    'awarded': 'Awarded',
    'pending': 'Draft',
    'cancelled': 'Closed'
  };

  // Format budget with currency
  const formatBudget = (value: number, currency: string = 'ZAR') => {
    return `${currency} ${value?.toLocaleString() || '0'}`;
  };

  return {
    id: apiTender._id || apiTender.id,
    title: apiTender.title || 'Untitled Tender',
    department: apiTender.organization || 'General',
    status: statusMap[apiTender.status] || 'Draft',
    deadline: apiTender.closingDate || new Date().toISOString(),
    budget: formatBudget(apiTender.value, apiTender.currency),
    submissions: 0, // This will be calculated separately
    category: apiTender.category || 'General',
    description: apiTender.description || '',
    referenceNumber: apiTender.tenderNumber || `TND-${Date.now()}`,
    requestedItems: apiTender.requirements || [],
    createdDate: apiTender.createdAt || apiTender.publishDate || new Date().toISOString(),
    location: apiTender.location || '',
    contractPeriod: '',
    cidbGrading: '',
    bbbeeLevel: '',
    contactPerson: apiTender.contactPerson?.name || '',
    contactEmail: apiTender.contactPerson?.email || '',
    contactPhone: apiTender.contactPerson?.phone || '',
    submissionMethod: 'online',
    tenderFee: 'No fee',
    advertisementLink: `https://example.gov.za/tenders/${apiTender.tenderNumber || apiTender._id}`
  };
};

// Mock submissions data (you can replace this with real API later)
const mockSubmissions: Submission[] = [
  {
    id: '1',
    tenderId: '1',
    supplier: 'ABC Construction',
    company: 'ABC Construction Ltd',
    proposal: 'Comprehensive maintenance proposal',
    amount: 150000,
    documents: [],
    status: 'under_review',
    score: 85,
    submittedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    tenderId: '1',
    supplier: 'XYZ Services',
    company: 'XYZ Services Pty Ltd',
    proposal: 'Alternative maintenance approach',
    amount: 120000,
    documents: [],
    status: 'submitted',
    submittedAt: new Date('2024-01-10').toISOString(),
  }
];

export function useTenderManagement(initialTenders: Tender[] = [], initialSubmissions: Submission[] = []) {
  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tenders from API on mount
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting data fetch...');
      
      // Fetch tenders from API
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
        console.warn('Tender API response indicates failure:', tenderResponse);
        setTenders(initialTenders);
      }

      // For now, use mock submissions - you can replace with real API later
      console.log('Using mock submissions data');
      setSubmissions(mockSubmissions);

    } catch (err: any) {
      console.error('Error in fetchData:', err);
      setError(err.message || 'Failed to load data from server');
      // Fallback to initial data if API fails
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

      // Prepare data for API
      const apiTenderData = {
        tenderNumber: tenderData.tenderNumber || `TND-${Date.now()}`,
        title: tenderData.title,
        description: tenderData.description || '',
        organization: tenderData.organization || 'University Procurement',
        category: tenderData.category || '',
        value: tenderData.value || 0,
        currency: tenderData.currency || 'ZAR',
        status: 'open',
        publishDate: new Date(),
        closingDate: new Date(tenderData.closingDate),
        location: tenderData.location || '',
        contactPerson: tenderData.contactPerson || {},
        requirements: tenderData.requirements || [],
        tags: tenderData.tags || [],
        metadata: {
          source: 'web-portal',
          lastUpdated: new Date(),
          createdBy: 'system-user'
        }
      };

      console.log('Creating tender with data:', apiTenderData);
      const response = await TenderAPI.createTender(apiTenderData);
      
      if (response.success) {
        // Map the created tender to dashboard format and add to state
        const newTender = mapApiTenderToDashboard(response.data);
        setTenders(prev => [newTender, ...prev]);
        return newTender;
      } else {
        throw new Error(response.message || 'Failed to create tender');
      }
    } catch (err: any) {
      console.error('Error in handleTenderCreate:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTenderStatusChange = useCallback(async (tenderId: string, newStatus: string) => {
    try {
      setError(null);

      // Map dashboard status back to API status
      const statusMap: { [key: string]: string } = {
        'Open': 'open',
        'Closed': 'closed',
        'Awarded': 'awarded',
        'Draft': 'pending',
        'Evaluation': 'open'
      };

      const apiStatus = statusMap[newStatus] || newStatus.toLowerCase();

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
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleDocumentsUpdate = useCallback(async (submissionId: string, documents: any[]) => {
    try {
      setError(null);
      // Update submission documents
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
                status: 'evaluated' as any
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
    handleTenderStatusChange,
    refreshTenders,
    
    // Submission operations
    handleDocumentsUpdate,
    handleEvaluationComplete,
  };
}