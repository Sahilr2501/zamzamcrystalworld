const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zamzamcrystalworld.onrender.com';

export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export function getStoredToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

export function setStoredToken(token) {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
}

async function request(path, options = {}) {
    const token = getStoredToken();
    const isFormData = options.body instanceof FormData;
    const headers = { ...options.headers };
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    let data = null;
    const text = await res.text();
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!res.ok) {
        throw new ApiError(data?.message || res.statusText, res.status, data);
    }
    return data;
}

export const api = {
    health: () => request('/api/health'),
    register: (body) => request('/api/users/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/api/users/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request('/api/users/logout', { method: 'POST' }),
    refresh: () => request('/api/users/refresh', { method: 'POST' }),
    getProfile: () => request('/api/users/profile'),
    updateProfile: (body) => request('/api/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
    getProducts: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return request(`/api/products${q ? `?${q}` : ''}`);
    },
    getCategories: () => request('/api/products/categories/list'),
    getProduct: (id) => request(`/api/products/${id}`),
    createProduct: (body) => request('/api/products', { method: 'POST', body: JSON.stringify(body) }),
    updateProduct: (id, body) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
    addReview: (id, body) => request(`/api/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
    validateCoupon: (body) => request('/api/coupons/validate', { method: 'POST', body: JSON.stringify(body) }),
    getCoupons: () => request('/api/coupons'),
    createCoupon: (body) => request('/api/coupons', { method: 'POST', body: JSON.stringify(body) }),
    deleteCoupon: (id) => request(`/api/coupons/${id}`, { method: 'DELETE' }),
    createOrder: (body) => request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
    getMyOrders: () => request('/api/orders/myorders'),
    getAllOrders: () => request('/api/orders/admin/all'),
    getOrder: (id) => request(`/api/orders/${id}`),
    payOrder: (id, body) => request(`/api/orders/${id}/pay`, { method: 'PUT', body: JSON.stringify(body) }),
    deliverOrder: (id, body) => request(`/api/orders/${id}/deliver`, { method: 'PUT', body: JSON.stringify(body) }),
    uploadProductImages: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        return request('/api/upload/images', { method: 'POST', body: formData });
    },
    // Add these to your api.js file

    getAdminStats: async () => {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    getChartData: async () => {
        const response = await fetch(`${API_URL}/admin/chart-data`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch chart data');
        return response.json();
    },

    getOrders: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/orders?${query}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },
};

export function resolveImageUrl(url) {
    if (!url) return '/placeholder-crystal.svg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return url;
}

export function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
}

export function productMinPrice(product) {
    if (!product?.variants?.length) return 0;
    return Math.min(...product.variants.map((v) => v.price));
}

export function productImage(product) {
    return resolveImageUrl(product?.images?.[0]);
}

