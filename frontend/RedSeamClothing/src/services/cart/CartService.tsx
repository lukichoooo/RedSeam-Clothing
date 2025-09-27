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
            throw new Error(`Failed to add product ${id} to cart.`);
        }
    },

    updateQuantity: async (id: number, newQuantity: number): Promise<void> =>
    {
        const validQuantity = Math.max(1, newQuantity);

        try
        {
            await cartApi.updateProductQuantity(id, validQuantity);
        } catch (error)
        {
            throw new Error(`Failed to update quantity for product ${id}.`);
        }
    },

    removeFromCart: async (id: number): Promise<void> =>
    {
        try
        {
            await cartApi.removeProductFromCart(id);
        } catch (error)
        {
            throw new Error(`Failed to remove product ${id} from cart.`);
        }
    },
    checkout: async (checkoutDetails: CheckoutDetails): Promise<{ success: boolean; message: string }> =>
    {
        try
        {
            const response = await cartApi.checkout(checkoutDetails);
            // This runs on successful 2xx response
            return { success: true, message: response.message };
        } catch (error: any)
        {
            // This runs on non-2xx response (4xx, 5xx) or network errors

            // Check if it's an Axios error with a response from the server
            if (error.response && error.response.data && error.response.data.message)
            {
                // Return the specific server message from the response body
                return {
                    success: false,
                    message: error.response.data.message
                };
            }

            // Handle network errors or unexpected exceptions with a generic message
            return { success: false, message: "Checkout failed. Please try again." };
        }
    },

};

export default cartService;