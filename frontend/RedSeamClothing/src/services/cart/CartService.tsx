import { cartApi, type CartProductResponse, type CartProductsQuery, type CheckoutDetails } from './cartApi';


export type ProductData =
    {
        id: number;
        color: string;
        size: string;
        quantity: number;
    };

export const cartService = {
    fetchCart: async (): Promise<CartProductResponse[]> =>
    {
        try
        {
            const cartItems: CartProductResponse[] = await cartApi.fetchCart();
            return cartItems;
        } catch (error)
        {
            throw new Error("Failed to load cart items.");
        }
    },

    addToCart: async (productData: ProductData): Promise<void> =>
    {
        const { id, color, size, quantity } = productData;

        const payload: CartProductsQuery = {
            quantity,
            color,
            size
        };

        try
        {
            await cartApi.addProductToCart(id, payload);
        } catch (error)
        {
            throw new Error(`Failed to add product ${id} with color ${color} and size ${size} to cart.`);
        }
    },

    updateQuantity: async (id: number, newQuantity: number, color: string, size: string): Promise<void> =>
    {
        const validQuantity = Math.max(1, newQuantity);

        try
        {
            await cartApi.updateProductQuantity(id, validQuantity, color, size);
        } catch (error)
        {
            throw new Error(`Failed to update quantity for product ${id} (Color: ${color}, Size: ${size}).`);
        }
    },

    removeFromCart: async (id: number, color: string, size: string): Promise<void> =>
    {
        try
        {
            await cartApi.removeProductFromCart(id, color, size);
        } catch (error)
        {
            throw new Error(`Failed to remove product ${id} (Color: ${color}, Size: ${size}) from cart.`);
        }
    },
    checkout: async (checkoutDetails: CheckoutDetails): Promise<{ success: boolean; message: string }> =>
    {
        try
        {
            const response = await cartApi.checkout(checkoutDetails);
            return { success: true, message: response.message };
        } catch (error: any)
        {
            if (error.response && error.response.data && error.response.data.message)
            {
                return {
                    success: false,
                    message: error.response.data.message
                };
            }

            return { success: false, message: "Checkout failed. Please try again." };
        }
    },

};

export default cartService;
