// lib/api/tenders.ts - Tender API Client
export interface TenderData {
    _id?: string;
    id?: string;
    tenderNumber: string;
    title: string;
    description?: string;
    organization?: string;
    category?: string;
    value?: number;
    currency?: string;
    status?: 'open' | 'closed' | 'awarded' | 'cancelled' | 'pending';
    publishDate?: string | Date;
    closingDate: string | Date;
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
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface TenderFilters {
    page?: number;
    limit?: number;
    status?: string;
    organization?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface TenderResponse {
    success: boolean;
    data: TenderData[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    message?: string;
    error?: string;
  }
  
  export interface SingleTenderResponse {
    success: boolean;
    data: TenderData;
    message?: string;
    error?: string;
  }
  
  export class TenderAPI {
    private static baseURL = '/api/tenders';
  
    /**
     * Create a new tender
     */
    static async createTender(data: TenderData): Promise<SingleTenderResponse> {
      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
  
        return result;
      } catch (error) {
        console.error('Error creating tender:', error);
        throw error;
      }
    }
  
    /**
     * Get all tenders with optional filters
     */
    static async getTenders(filters?: TenderFilters): Promise<TenderResponse> {
      try {
        const params = new URLSearchParams();
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, value.toString());
            }
          });
        }
  
        const url = `${this.baseURL}?${params.toString()}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
  
        return result;
      } catch (error) {
        console.error('Error fetching tenders:', error);
        throw error;
      }
    }
  
    /**
     * Get a single tender by ID
     */
    static async getTenderById(id: string): Promise<SingleTenderResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
  
        return result;
      } catch (error) {
        console.error('Error fetching tender:', error);
        throw error;
      }
    }
  
    /**
     * Update a tender
     */
    static async updateTender(id: string, data: Partial<TenderData>): Promise<SingleTenderResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
  
        return result;
      } catch (error) {
        console.error('Error updating tender:', error);
        throw error;
      }
    }
  
    /**
     * Delete a tender
     */
    static async deleteTender(id: string): Promise<SingleTenderResponse> {
      try {
        const response = await fetch(`${this.baseURL}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
  
        return result;
      } catch (error) {
        console.error('Error deleting tender:', error);
        throw error;
      }
    }
  
    /**
     * Get tender statistics
     */
    static async getTenderStats(): Promise<{
      success: boolean;
      data: {
        total: number;
        open: number;
        closed: number;
        awarded: number;
        cancelled: number;
        pending: number;
        byCategory: Record<string, number>;
        byOrganization: Record<string, number>;
      };
    }> {
      try {
        // This could be a separate API endpoint or calculated from existing data
        const tendersResponse = await this.getTenders({ limit: 1000 });
        
        if (!tendersResponse.success) {
          throw new Error('Failed to fetch tenders for statistics');
        }
  
        const tenders = tendersResponse.data;
        
        const stats = {
          total: tenders.length,
          open: tenders.filter(t => t.status === 'open').length,
          closed: tenders.filter(t => t.status === 'closed').length,
          awarded: tenders.filter(t => t.status === 'awarded').length,
          cancelled: tenders.filter(t => t.status === 'cancelled').length,
          pending: tenders.filter(t => t.status === 'pending').length,
          byCategory: {} as Record<string, number>,
          byOrganization: {} as Record<string, number>,
        };
  
        // Calculate category statistics
        tenders.forEach(tender => {
          if (tender.category) {
            stats.byCategory[tender.category] = (stats.byCategory[tender.category] || 0) + 1;
          }
          if (tender.organization) {
            stats.byOrganization[tender.organization] = (stats.byOrganization[tender.organization] || 0) + 1;
          }
        });
  
        return {
          success: true,
          data: stats,
        };
      } catch (error) {
        console.error('Error fetching tender statistics:', error);
        throw error;
      }
    }
  
    /**
     * Search tenders by keyword
     */
    static async searchTenders(query: string, filters?: Omit<TenderFilters, 'search'>): Promise<TenderResponse> {
      return this.getTenders({
        ...filters,
        search: query,
      });
    }
  
    /**
     * Get tenders by status
     */
    static async getTendersByStatus(status: TenderData['status'], filters?: Omit<TenderFilters, 'status'>): Promise<TenderResponse> {
      return this.getTenders({
        ...filters,
        status,
      });
    }
  
    /**
     * Get upcoming deadline tenders
     */
    static async getUpcomingTenders(days: number = 7): Promise<TenderResponse> {
      try {
        const allTenders = await this.getTenders({ status: 'open', limit: 1000 });
        
        if (!allTenders.success) {
          throw new Error('Failed to fetch tenders for upcoming deadlines');
        }
  
        const now = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() + days);
  
        const upcomingTenders = allTenders.data.filter(tender => {
          const closingDate = new Date(tender.closingDate);
          return closingDate > now && closingDate <= cutoffDate;
        });
  
        return {
          success: true,
          data: upcomingTenders,
          pagination: {
            total: upcomingTenders.length,
            page: 1,
            limit: upcomingTenders.length,
            pages: 1,
          },
        };
      } catch (error) {
        console.error('Error fetching upcoming tenders:', error);
        throw error;
      }
    }
  
    /**
     * Bulk update tender status
     */
    static async bulkUpdateStatus(tenderIds: string[], status: TenderData['status']): Promise<{
      success: boolean;
      message: string;
      updatedCount: number;
      errors: string[];
    }> {
      try {
        const results = await Promise.allSettled(
          tenderIds.map(id => this.updateTender(id, { status }))
        );
  
        const updatedCount = results.filter(result => 
          result.status === 'fulfilled' && result.value.success
        ).length;
  
        const errors = results
          .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
          .map(result => result.reason.message);
  
        return {
          success: updatedCount > 0,
          message: `Updated ${updatedCount} of ${tenderIds.length} tenders`,
          updatedCount,
          errors,
        };
      } catch (error) {
        console.error('Error in bulk update:', error);
        throw error;
      }
    }
  }
  
  // Utility functions for working with tender data
  export class TenderUtils {
    /**
     * Convert tender data for form handling
     */
    static formatTenderForForm(tender: TenderData): Partial<TenderData> {
      return {
        tenderNumber: tender.tenderNumber,
        title: tender.title,
        description: tender.description,
        organization: tender.organization,
        category: tender.category,
        value: tender.value,
        currency: tender.currency,
        status: tender.status,
        publishDate: tender.publishDate ? new Date(tender.publishDate).toISOString().split('T')[0] : undefined,
        closingDate: new Date(tender.closingDate).toISOString().split('T')[0],
        location: tender.location,
        contactPerson: tender.contactPerson,
        requirements: tender.requirements,
        tags: tender.tags,
      };
    }
  
    /**
     * Validate tender data before submission
     */
    static validateTenderData(data: Partial<TenderData>): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
  
      if (!data.tenderNumber?.trim()) {
        errors.push('Tender number is required');
      }
  
      if (!data.title?.trim()) {
        errors.push('Title is required');
      }
  
      if (!data.closingDate) {
        errors.push('Closing date is required');
      } else if (new Date(data.closingDate) <= new Date()) {
        errors.push('Closing date must be in the future');
      }
  
      if (data.value !== undefined && data.value < 0) {
        errors.push('Value cannot be negative');
      }
  
      return {
        isValid: errors.length === 0,
        errors,
      };
    }
  
    /**
     * Calculate days until closing
     */
    static getDaysUntilClosing(closingDate: string | Date): number {
      const now = new Date();
      const closing = new Date(closingDate);
      const diffTime = closing.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  
    /**
     * Check if tender is expiring soon (within 7 days)
     */
    static isExpiringSoon(closingDate: string | Date): boolean {
      const daysUntilClosing = this.getDaysUntilClosing(closingDate);
      return daysUntilClosing <= 7 && daysUntilClosing >= 0;
    }
  
    /**
     * Check if tender has expired
     */
    static isExpired(closingDate: string | Date): boolean {
      return new Date(closingDate) < new Date();
    }
  
    /**
     * Format tender value with currency
     */
    static formatValue(value?: number, currency: string = 'ZAR'): string {
      if (value === undefined || value === null) return 'N/A';
      
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
  
    /**
     * Generate a unique tender number
     */
    static generateTenderNumber(organization?: string): string {
      const prefix = organization ? organization.substring(0, 3).toUpperCase() : 'TND';
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      
      return `${prefix}-${timestamp}-${random}`;
    }
  }
  
  // Default export for convenience
  export default TenderAPI;