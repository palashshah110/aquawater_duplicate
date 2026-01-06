const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Custom error class for API errors
export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public errors?: { field: string; message: string }[];

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    errors?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

// Token expiration event
const TOKEN_EXPIRED_EVENT = 'auth:token-expired';

export const onTokenExpired = (callback: () => void) => {
  window.addEventListener(TOKEN_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(TOKEN_EXPIRED_EVENT, callback);
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Get auth token from localStorage
  const token = localStorage.getItem('adminToken');

  const config: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
    },
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  try {
    const response = await fetch(url, config);

    // Handle network errors
    if (!response.ok) {
      let data: { message?: string; code?: string; errors?: { field: string; message: string }[] };

      try {
        data = await response.json();
      } catch {
        data = { message: 'Network error occurred' };
      }

      // Handle token expiration
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        // Check if token expired specifically
        if (data.code === 'TOKEN_EXPIRED') {
          window.dispatchEvent(new CustomEvent(TOKEN_EXPIRED_EVENT));
        }

        // Redirect to login
        if (window.location.pathname.startsWith('/admin') &&
            window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }

      // Handle rate limiting
      if (response.status === 429) {
        throw new ApiError(
          data.message || 'Too many requests. Please try again later.',
          429,
          'RATE_LIMITED'
        );
      }

      // Handle validation errors
      if (response.status === 400 && data.errors) {
        throw new ApiError(
          data.message || 'Validation failed',
          400,
          'VALIDATION_ERROR',
          data.errors
        );
      }

      throw new ApiError(
        data.message || 'Something went wrong',
        response.status,
        data.code
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Retry on network errors
    if (error instanceof TypeError && retries > 0) {
      console.warn(`Retrying request to ${endpoint}... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchApi<T>(endpoint, options, retries - 1);
    }

    // Re-throw ApiErrors as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      'NETWORK_ERROR'
    );
  }
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string | Category;
  price: number;
  discountPrice?: number;
  images: { url: string; publicId: string }[];
  rating: number;
  reviews: number;
  description: string;
  shortDescription?: string;
  features: string[];
  specs: {
    warranty: string;
    power: string;
    compatibility: string;
    dimensions?: string;
    weight?: string;
  };
  stock: number;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Order Types
export interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  product: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
  payment: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    method: string;
    status: string;
  };
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  orderStatus: string;
  trackingNumber?: string;
  notes?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderStats {
  success: boolean;
  data: {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  order: number;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  data: Category[];
}

// Banner Types
export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: {
    url: string;
    publicId: string;
  };
  buttonText: string;
  buttonLink: string;
  badge?: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannersResponse {
  success: boolean;
  data: Banner[];
}

// ============ PRODUCTS API ============
export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    search?: string;
    featured?: boolean;
    active?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return fetchApi<ProductsResponse>(`/products${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => {
    return fetchApi<{ success: boolean; data: Product }>(`/products/${id}`);
  },

  getCategories: () => {
    return fetchApi<{ success: boolean; data: Category[] }>('/categories/');
  },

  create: (formData: FormData) => {
    return fetchApi<{ success: boolean; message: string; data: Product }>(
      '/products',
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  update: (id: string, formData: FormData) => {
    return fetchApi<{ success: boolean; message: string; data: Product }>(
      `/products/${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );
  },

  delete: (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ ORDERS API ============
export const ordersApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return fetchApi<OrdersResponse>(`/orders${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => {
    return fetchApi<{ success: boolean; data: Order }>(`/orders/${id}`);
  },

  getStats: () => {
    return fetchApi<OrderStats>('/orders/stats');
  },

  getRevenueChartData: () => {
    return fetchApi<{ success: boolean; data: { month: string; revenue: number }[] }>('/orders/chart/revenue');
  },

  getWeeklyOrdersChartData: () => {
    return fetchApi<{ success: boolean; data: { day: string; orders: number }[] }>('/orders/chart/weekly');
  },

  updateStatus: (id: string, data: { orderStatus: string; trackingNumber?: string }) => {
    return fetchApi<{ success: boolean; message: string; data: Order }>(
      `/orders/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  cancel: (id: string) => {
    return fetchApi<{ success: boolean; message: string; data: Order }>(
      `/orders/${id}/cancel`,
      {
        method: 'PUT',
      }
    );
  },

  delete: (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ BANNERS API ============
export const bannersApi = {
  getAll: (active?: boolean) => {
    const query = active !== undefined ? `?active=${active}` : '';
    return fetchApi<BannersResponse>(`/banners${query}`);
  },

  getAllAdmin: () => {
    return fetchApi<BannersResponse>('/banners/admin/all');
  },

  getById: (id: string) => {
    return fetchApi<{ success: boolean; data: Banner }>(`/banners/${id}`);
  },

  create: (formData: FormData) => {
    return fetchApi<{ success: boolean; message: string; data: Banner }>(
      '/banners',
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  update: (id: string, formData: FormData) => {
    return fetchApi<{ success: boolean; message: string; data: Banner }>(
      `/banners/${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );
  },

  delete: (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/banners/${id}`, {
      method: 'DELETE',
    });
  },

  reorder: (banners: { id: string; order: number }[]) => {
    return fetchApi<{ success: boolean; message: string; data: Banner[] }>(
      '/banners/reorder',
      {
        method: 'PUT',
        body: JSON.stringify({ banners }),
      }
    );
  },
};

// ============ CATEGORIES API ============
export const categoriesApi = {
  getAll: (active?: boolean) => {
    const query = active !== undefined ? `?active=${active}` : '';
    return fetchApi<CategoriesResponse>(`/categories${query}`);
  },

  getById: (id: string) => {
    return fetchApi<{ success: boolean; data: Category }>(`/categories/${id}`);
  },

  create: (data: Category) => {
    return fetchApi<{ success: boolean; message: string; data: Category }>(
      '/categories',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  update: (id: string, data: Category) => {
    return fetchApi<{ success: boolean; message: string; data: Category }>(
      `/categories/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  delete: (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  reorder: (categories: { id: string; order: number }[]) => {
    return fetchApi<{ success: boolean; message: string }>(
      '/categories/reorder',
      {
        method: 'PUT',
        body: JSON.stringify({ categories }),
      }
    );
  },

  updateCounts: () => {
    return fetchApi<{ success: boolean; message: string }>(
      '/categories/update-counts',
      {
        method: 'PUT',
      }
    );
  },
};

// Article Types
export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: {
    url: string;
    publicId: string;
  };
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  readTime: number;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  success: boolean;
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============ ARTICLES API ============
export const articlesApi = {
  // Public endpoints
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return fetchApi<ArticlesResponse>(`/articles${query ? `?${query}` : ''}`);
  },

  getCategories: () => {
    return fetchApi<{ success: boolean; data: string[] }>('/articles/categories');
  },

  getTags: () => {
    return fetchApi<{ success: boolean; data: { name: string; count: number }[] }>('/articles/tags');
  },

  getRelated: (id: string) => {
    return fetchApi<{ success: boolean; data: Article[] }>(`/articles/${id}/related`);
  },

  // Admin endpoints
  getAllAdmin: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return fetchApi<ArticlesResponse>(`/articles/admin/all${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => {
    return fetchApi<{ success: boolean; data: Article }>(`/articles/${id}?admin=true`);
  },

  create: (formData: FormData) => {
    return fetchApi<{ success: boolean; message: string; data: Article }>(
      '/articles',
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  update: (id: string, formData: FormData) => {
    return fetchApi<{ success: boolean; message: string; data: Article }>(
      `/articles/${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );
  },

  delete: (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/articles/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  products: productsApi,
  orders: ordersApi,
  banners: bannersApi,
  categories: categoriesApi,
  articles: articlesApi,
};
