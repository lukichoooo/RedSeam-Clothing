import api from '../api';

// List of products

export type Data =
    {
        id: number,
        image: string
        name: string,
        price: number,
        release_year: string
    }

export type Links =
    {
        first: string,
        last: string,
        prev: string | null, // prev can be null on the first page
        next: string | null  // next can be null on the last page
    }

export type Meta =
    {
        current_page: number,
        current_page_url: string,
        from: number,
        path: string,
        per_page: number,
        to: number,
        total: number // Added based on usage in the component
    }

export type ProductsListResponse =
    {
        data: Data[],
        links: Links,
        meta: Meta
    }

export type productsListQuery =
    {
        page?: number;
        'filter[price_from]'?: number,
        'filter[price_to]'?: number,
        sort?: string;
    }

// Per Product

export type ProductByIdQuery =
    {
        id: number
    }

export type Brand =
    {
        id: number,
        image: string,
        name: string
    }

export type ProductByIdResponse =
    {
        brand: Brand,
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

export default productsApi;