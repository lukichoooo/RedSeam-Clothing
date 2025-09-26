import React, { createContext, useContext, useState } from "react";

interface CartItem
{
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType
{
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: number, newQuantity: number) => void;
    removeFromCart: (id: number) => void;
}

interface CartItem
{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    color?: string;
    size?: string;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
{
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) =>
    {
        setItems((prev) =>
        {
            const existing = prev.find((i) => i.id === item.id);
            if (existing)
            {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const updateQuantity = (id: number, newQuantity: number) =>
    {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(newQuantity, 1) } : i))
        );
    };

    const removeFromCart = (id: number) =>
    {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart }}>
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
