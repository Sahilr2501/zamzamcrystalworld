import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'zamzam_cart';

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setItems(JSON.parse(saved));
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((product, variant, qty = 1) => {
        setItems((prev) => {
            const key = `${product._id}-${variant.sku}`;
            const existing = prev.find((i) => i.key === key);
            if (existing) {
                return prev.map((i) =>
                    i.key === key ? { ...i, qty: Math.min(i.qty + qty, variant.countInStock) } : i
                );
            }
            return [
                ...prev,
                {
                    key,
                    product: product._id,
                    name: product.name,
                    image: product.images?.[0],
                    sku: variant.sku,
                    price: variant.price,
                    qty,
                    countInStock: variant.countInStock,
                    attributes: variant.attributes,
                },
            ];
        });
    }, []);

    const updateQty = useCallback((key, qty) => {
        setItems((prev) =>
            prev
                .map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, i.countInStock)) } : i))
                .filter((i) => i.qty > 0)
        );
    }, []);

    const removeItem = useCallback((key) => {
        setItems((prev) => prev.filter((i) => i.key !== key));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const itemsCount = items.reduce((acc, i) => acc + i.qty, 0);
    const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, updateQty, removeItem, clearCart, itemsCount, subtotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
