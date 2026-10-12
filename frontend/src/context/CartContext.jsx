import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id && item.size === product.size
            ? {
              ...item,
              quantity: item.quantity + quantity,
            }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.id === id && item.size === size)
      )
    );
  };

  const increaseQuantity = (id, size) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.size === size
          ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item
      )
    );
  };

  const decreaseQuantity = (id, size) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id && item.size === size
            ? {
              ...item,
              quantity: item.quantity - 1,
            }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}