import api from '../api';
import type { Brand } from '../products/productsApi';

export type CartProductsQuery =
    {
        color: string;
        quantity: number;
        size: string;
    };

export type CartProductResponse =
    {
        brand: Brand,
        cover_image: string,
        description: string,
        id: number,
        images: string[],
        name: string,
        price: number,
        quantity: number,
        release_date: String,
        total_price: number,
    }

export type CheckoutDetails =
    {
        name: string;
        surname: string;
        email: string;
        address: string;
        zip_code: string;
    };


export const cartApi = {

    addProductToCart: async (productId: number, query: CartProductsQuery): Promise<CartProductResponse> =>
    {
        const response = await api.post<CartProductResponse>(`/cart/products/${productId}`, query);
        return response.data;
    },

    updateProductQuantity: async (productId: number, newQuantity: number): Promise<CartProductResponse> =>
    {
        const response = await api.patch<CartProductResponse>(`/cart/products/${productId}`, { quantity: newQuantity });
        return response.data;
    },

    removeProductFromCart: async (productId: number): Promise<void> =>
    {
        await api.delete(`/cart/products/${productId}`);
    },

    fetchCart: async (): Promise<CartProductResponse[]> =>
    {
        const response = await api.get<CartProductResponse[]>('/cart');
        return response.data;
    },

    // FIX: Update checkout to accept the required details and send them in the request body
    checkout: async (details: CheckoutDetails): Promise<{ message: string }> =>
    {
        const response = await api.post<{ message: string }>('/cart/checkout', details);
        return response.data;
    },
};