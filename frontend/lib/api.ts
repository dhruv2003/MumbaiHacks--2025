// API utility functions for interacting with the Anumati API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://anumati.thisisdhruv.in/api/v1';

// Store user ID (no-auth mode - using user_id query parameter)
let currentUserId: string | null = null;

export const setUserId = (userId: string) => {
    currentUserId = userId;
    if (typeof window !== 'undefined') {
        localStorage.setItem('user_id', userId);
    }
};

export const getUserId = (): string | null => {
    if (currentUserId) return currentUserId;
    if (typeof window !== 'undefined') {
        currentUserId = localStorage.getItem('user_id');
    }
    return currentUserId;
};

export const clearUserId = () => {
    currentUserId = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_data');
    }
};

export const setUserData = (userData: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(userData));
    }
};

export const getUserData = (): any | null => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('user_data');
        return data ? JSON.parse(data) : null;
    }
    return null;
};

async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
    const userId = getUserId();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Add custom headers from options
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    // Build URL with user_id query parameter if userId exists and not a public endpoint
    let url = `${API_BASE_URL}${endpoint}`;
    const isPublicEndpoint = endpoint.includes('/auth/users') || endpoint.includes('/auth/register');

    if (userId && !isPublicEndpoint) {
        const separator = endpoint.includes('?') ? '&' : '?';
        url += `${separator}user_id=${userId}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call error:', error);
        return { success: false, error: 'Network error' };
    }
}

// Auth APIs
export const getAllUsers = async () => {
    return apiCall<{ count: number; users: any[] }>('/auth/users');
};

export const login = async (aaHandle: string, pin: string) => {
    const result = await apiCall<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ aaHandle, pin }),
    });

    if (result.success && result.data?.user) {
        // Store user ID and data in no-auth mode
        if (result.data.user.id || result.data.user._id) {
            const userId = result.data.user.id || result.data.user._id;
            setUserId(userId);
            setUserData(result.data.user);
        }
    }

    return result;
};

export const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    pan: string;
    pin: string;
    dob: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    dependents?: any[];
    creditCards?: any[];
    goldGrams?: number;
    silverGrams?: number;
}) => {
    const result = await apiCall<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    if (result.success && result.data?.user) {
        // Store user ID and data
        if (result.data.user.id || result.data.user._id) {
            const userId = result.data.user.id || result.data.user._id;
            setUserId(userId);
            setUserData(result.data.user);
        }
    }

    return result;
};

export const logout = async () => {
    clearUserId();
    return { success: true };
};

export const getProfile = async () => {
    return apiCall<any>('/auth/profile');
};

export const updateProfile = async (profileData: any) => {
    return apiCall<any>('/auth/form', {
        method: 'POST',
        body: JSON.stringify(profileData),
    });
};

// Account APIs
export const getAccounts = async () => {
    return apiCall<{ count: number; accounts: any[] }>('/accounts');
};

export const getAccountById = async (accountId: string) => {
    return apiCall<any>(`/accounts/${accountId}`);
};

// Aggregated Data APIs
export const getNetWorth = async () => {
    return apiCall<any>('/aggregated/net-worth');
};

export const getTransactions = async (params?: {
    from?: string;
    to?: string;
    category?: string;
    limit?: number;
    offset?: number;
}) => {
    const queryParams = new URLSearchParams();
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    return apiCall<any>(`/aggregated/transactions${queryString ? `?${queryString}` : ''}`);
};

export const getInvestments = async () => {
    return apiCall<any>('/aggregated/investments');
};

export const getLiabilities = async () => {
    return apiCall<any>('/aggregated/liabilities');
};

export const getMonthlySpending = async (months: number = 6) => {
    return apiCall<any>(`/aggregated/monthly-spending?months=${months}`);
};

export const getIncomeSources = async () => {
    return apiCall<any>('/aggregated/income-sources');
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
