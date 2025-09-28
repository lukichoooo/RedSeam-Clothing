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
        color: string,
        size: string,
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

    updateProductQuantity: async (productId: number, newQuantity: number, color: string, size: string): Promise<CartProductResponse> =>
    {
        const payload = {
            quantity: newQuantity,
            color,
            size,
        };
        const response = await api.patch<CartProductResponse>(`/cart/products/${productId}`, payload);
        return response.data;
    },

    removeProductFromCart: async (productId: number, color: string, size: string): Promise<void> =>
    {
        const payload = {
            color,
            size
        };

        await api.request({
            method: 'DELETE',
            url: `/cart/products/${productId}`,
            data: payload
        });
    },


    fetchCart: async (): Promise<CartProductResponse[]> =>
    {
        const response = await api.get<CartProductResponse[]>('/cart');
        return response.data;
    },

    checkout: async (details: CheckoutDetails): Promise<{ message: string }> =>
    {
        // This was already correct, sending details in the request body.
        const response = await api.post<{ message: string }>('/cart/checkout', details);
        return response.data;
    },
};