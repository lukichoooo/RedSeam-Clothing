
export type CartProductResponse =
    {
        id: number;
        name: string;
        description: string;
        cover_image: string;
        price: number;
        quantity: number;
        total_price: number;
    }

// The local structure of a cart item used in the React state
export interface CartItem
{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    color?: string;
    size?: string;
}

// Type for the product data required when adding an item from a product page
export interface ProductData
{
    id: number;
    color?: string;
    size?: string;
    quantity: number;
}

// Type for the API payload when adding a product
export type AddToCartPayload =
    {
        color?: string;
        size?: string;
        quantity: number;
    }

// Context Interface: All cart modification functions are asynchronous
export interface CartContextType
{
    items: CartItem[];
    fetchCart: () => Promise<void>;
    addToCart: (productData: ProductData) => Promise<void>;
    updateQuantity: (id: number, newQuantity: number) => Promise<void>;
    removeFromCart: (id: number) => Promise<void>;
    checkout: () => Promise<{ success: boolean; message: string }>;
}

// Helper function to map API response to local CartItem type
export const mapResponseToCartItem = (res: CartProductResponse): CartItem => ({
    id: res.id,
    name: res.name,
    price: res.price,
    quantity: res.quantity,
    image: res.cover_image,
    color: 'N/A',
    size: 'N/A',
});