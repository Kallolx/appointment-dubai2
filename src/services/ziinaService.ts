import { buildApiUrl } from "@/config/api";

// Ziina API Configuration
const ZIINA_API_BASE_URL = "https://api-v2.ziina.com/api"; // Real Ziina API URL
const ZIINA_API_KEY = import.meta.env.VITE_ZIINA_API_KEY; // Add this to your .env file

export interface ZiinaPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  customer_email?: string;
  customer_phone?: string;
  return_url: string;
  cancel_url: string;
}

export interface ZiinaPaymentResponse {
  success: boolean;
  payment_id: string;
  payment_url: string;
  status: string;
  message?: string;
}

export interface ZiinaPaymentStatus {
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  order_id: string;
  created_at: string;
  updated_at: string;
}

class ZiinaService {
  private apiKey: string;

  constructor() {
    this.apiKey = ZIINA_API_KEY;
    if (!this.apiKey) {
      console.error('Ziina API key is not configured');
    }
  }

  /**
   * Create a payment request with Ziina
   */
  async createPayment(paymentData: ZiinaPaymentRequest): Promise<ZiinaPaymentResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Ziina API key is not configured');
      }

      const response = await fetch(`${ZIINA_API_BASE_URL}/payment_intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: paymentData.amount * 100, // Convert to fils (100 AED = 10000 fils)
          currency_code: paymentData.currency,
          success_url: paymentData.return_url,
          cancel_url: paymentData.cancel_url,
          test: true // Test mode for development
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }

      return {
        success: true,
        payment_id: data.id || data.payment_id,
        payment_url: data.redirect_url || data.payment_url,
        status: data.status || 'pending',
        message: data.message || 'Payment created successfully'
      };
    } catch (error) {
      console.error('Ziina payment creation error:', error);
      return {
        success: false,
        payment_id: '',
        payment_url: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }

  /**
   * Check payment status
   */
  async getPaymentStatus(paymentId: string): Promise<ZiinaPaymentStatus | null> {
    try {
      if (!this.apiKey) {
        throw new Error('Ziina API key is not configured');
      }

      const response = await fetch(`${ZIINA_API_BASE_URL}/payment_intent/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get payment status');
      }

      return {
        payment_id: data.payment_id,
        status: data.status,
        amount: data.amount / 100, // Convert from cents
        currency: data.currency,
        order_id: data.order_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Ziina payment status error:', error);
      return null;
    }
  }

  /**
   * Verify payment webhook signature (if Ziina provides webhooks)
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Implement webhook signature verification if Ziina provides it
    // This is a placeholder - check Ziina documentation for actual implementation
    return true;
  }

  /**
   * Create payment through your backend (recommended for security)
   */
  async createPaymentViaBackend(paymentData: ZiinaPaymentRequest): Promise<ZiinaPaymentResponse> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const url = buildApiUrl('/api/payments/ziina/create') + '?t=' + Date.now();
      console.log('Ziina Service - Making POST request to:', url);
      console.log('Ziina Service - Request data:', paymentData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      
      console.log('Ziina Service - Response status:', response.status);
      console.log('Ziina Service - Response URL:', response.url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }

      return data;
    } catch (error) {
      console.error('Backend Ziina payment creation error:', error);
      return {
        success: false,
        payment_id: '',
        payment_url: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }



  /**
   * Check payment status via backend
   */
  async getPaymentStatusViaBackend(paymentId: string): Promise<ZiinaPaymentStatus | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(buildApiUrl(`/api/payments/ziina/status/${paymentId}`), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get payment status');
      }

      return data;
    } catch (error) {
      console.error('Backend Ziina payment status error:', error);
      return null;
    }
  }
}

export const ziinaService = new ZiinaService();
export default ziinaService;
