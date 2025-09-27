import api from '../api';

// List of products

export type data =
    {
        id: number,
        image: string
        name: string,
        price: number,
        release_year: number
    }

export type links =
    {
        first: string,
        last: string,
        prev: string,
        next: string
    }

export type meta =
    {
        current_page: number,
        current_page_url: string,
        from: number, // starting item idx on curr page
        path: string, // base api url
        per_page: number,
        to: number,
        total: number // TODO: idk if this is returend
    }

export type ProductsListResponse =
    {
        data: data[],
        links: links,
        meta: meta
    }


export type productsListQuery =
    {
        page?: number;
        'filter[price_from]'?: number,
        'filter[price_to]'?: number,
        sort?: string;
    }

export type productsListResponse =
    {
        data: data[],
        links: links,
        meta: meta
    }

// Per Product

export type ProductByIdQuery =
    {
        id: number
    }

export type brand =
    {
        id: number,
        image: string,
        name: string
    }

export type ProductByIdResponse =
    {
        brand: brand,
        cover_image: string,
        description: string,
        id: number,
        images: string[],
        name: string,
        price: number
        quantity: number
        release_date: Date
        total_price: number
    }

export const productsApi = {
    fetchProductsList: async (productsListQuery: productsListQuery): Promise<ProductsListResponse> =>
    {
        const response = await api.get<ProductsListResponse>('/products', {
            params: productsListQuery
        });
        return response.data;
    },

    fetchProductById: async (query: ProductByIdQuery): Promise<ProductByIdResponse> =>
    {
        const response = await api.get<ProductByIdResponse>(`/products/${query.id}`);
        return response.data;
    },
};