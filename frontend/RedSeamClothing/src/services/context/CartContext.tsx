import React, { createContext, useContext, useState, useEffect } from "react";
// Import API methods from the separate file
import { cartApi } from '../user/cartApi';
// Import all necessary types and the mapping function
import
{
    type CartItem,
    type ProductData,
    type AddToCartPayload,
    type CartContextType,
    mapResponseToCartItem
} from '../user/cart.types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
{
    const [items, setItems] = useState<CartItem[]>([]);

    const fetchCart = async () =>
    {
        try
        {
            const cartItems = await cartApi.fetchCart();
            const localItems = cartItems.map(mapResponseToCartItem);
            setItems(localItems);
        } catch (error)
        {
            console.error("Failed to fetch cart:", error);
        }
    };

    const addToCart = async (productData: ProductData) =>
    {
        const { id, color, size, quantity } = productData;

        const payload: AddToCartPayload = {
            quantity,
            color,
            size
        };

        try
        {
            // Call API to add product
            await cartApi.addProductToCart(id, payload);

            await fetchCart();

        } catch (error)
        {
            console.error(`Failed to add product ${id} to cart:`, error);
            // Handle error (e.g., product out of stock)
        }
    };

    const updateQuantity = async (id: number, newQuantity: number) =>
    {
        const validQuantity = Math.max(1, newQuantity);

        try
        {
            await cartApi.updateProductQuantity(id, validQuantity);

            await fetchCart();

        } catch (error)
        {
            console.error(`Failed to update quantity for product ${id}:`, error);
        }
    };

    const removeFromCart = async (id: number) =>
    {
        try
        {
            // Call API to remove product
            await cartApi.removeProductFromCart(id);

            // Re-fetch the entire cart
            await fetchCart();

        } catch (error)
        {
            console.error(`Failed to remove product ${id} from cart:`, error);
        }
    };

    const checkout = async (): Promise<{ success: boolean; message: string }> =>
    {
        try
        {
            const response = await cartApi.checkout();
            // Clear local state upon successful checkout
            setItems([]);
            return { success: true, message: response.message };
        } catch (error)
        {
            console.error("Checkout failed:", error);
            return { success: false, message: "Checkout failed. Please try again." };
        }
    };

    // Initial cart load when provider mounts
    useEffect(() =>
    {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ items, fetchCart, addToCart, updateQuantity, removeFromCart, checkout }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () =>
{
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};