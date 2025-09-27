import axios from 'axios';
import type { CartProductResponse } from '../user/cart.types';
import type { AddToCartPayload } from './cart.types';

const API_BASE_URL = 'https://api.redseam.redberryinternship.ge/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

export const cartApi = {
    fetchCart: async (): Promise<CartProductResponse[]> =>
    {
        const response = await apiClient.get<CartProductResponse[]>('/cart');
        return response.data;
    },

    addProductToCart: async (productId: number, payload: AddToCartPayload): Promise<CartProductResponse> =>
    {
        const response = await apiClient.post<CartProductResponse>(`/cart/products/${productId}`, payload);
        return response.data;
    },

    updateProductQuantity: async (productId: number, newQuantity: number): Promise<CartProductResponse> =>
    {
        const response = await apiClient.patch<CartProductResponse>(`/cart/products/${productId}`, { quantity: newQuantity });
        return response.data;
    },

    removeProductFromCart: async (productId: number): Promise<void> =>
    {
        await apiClient.delete(`/cart/products/${productId}`);
    },

    checkout: async (): Promise<{ message: string }> =>
    {
        const response = await apiClient.post<{ message: string }>('/cart/checkout');
        return response.data;
    },
};

apiClient.interceptors.request.use(config =>
{
    const token = localStorage.getItem('token');
    if (token)
    {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});