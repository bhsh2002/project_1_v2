import { createContext, useState, useEffect, useContext } from 'react';

// إنشاء السياق
const CartContext = createContext();

// हुक مخصص لتسهيل استخدام السياق
export const useCart = () => useContext(CartContext);

// مزود السياق الذي سيحتوي على كل المنطق
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('shoppingCart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart data from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.id === product.id);
            if (exist) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.id === productId);
            if (exist.quantity === 1) {
                return prevItems.filter(item => item.id !== productId);
            }
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
        });
    };

    const deleteFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]); // ببساطة قم بتعيين المصفوفة إلى فارغة
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);


    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        cartCount,
        totalPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};