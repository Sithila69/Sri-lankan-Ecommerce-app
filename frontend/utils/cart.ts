export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  seller: string;
  stock: number;
  type?: "product" | "service";
  booking_required?: boolean;
  service_type?: "on_site" | "remote" | "hybrid";
}

const CART_KEY = "guest_cart";

// Get cart from localStorage
export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (err) {
    console.error("Failed to read guest cart", err);
    return [];
  }
};

// Save cart to localStorage
export const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

// Add or update item with stock check
export const addToCart = (
  newItem: CartItem,
  stockAvailable: number
): boolean => {
  const cart = getCart();
  const existing = cart.find((item) => item.product_id === newItem.product_id);

  // For services, don't allow duplicates - just replace if exists
  if (newItem.type === "service") {
    if (existing) {
      // Update existing service
      const updatedCart = cart.map((item) =>
        item.product_id === newItem.product_id ? newItem : item
      );
      saveCart(updatedCart);
    } else {
      // Add new service
      cart.push(newItem);
      saveCart(cart);
    }

    // Dispatch custom event to notify components about cart update
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    return true;
  }

  // For products, handle quantity and stock
  const currentQty = existing ? existing.quantity : 0;
  const totalDesiredQty = currentQty + newItem.quantity;

  if (totalDesiredQty > stockAvailable) {
    return false; // Exceeds stock
  }

  if (existing) {
    existing.quantity = totalDesiredQty;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);

  // Dispatch custom event to notify components about cart update
  window.dispatchEvent(new CustomEvent("cartUpdated"));

  return true;
};

// Remove item by product_id
export const removeFromCart = (productId: string) => {
  const cart = getCart().filter((item) => item.product_id !== productId);
  saveCart(cart);

  // Dispatch custom event to notify components about cart update
  window.dispatchEvent(new CustomEvent("cartUpdated"));
};

// Update quantity directly with stock check
export const updateQuantity = (
  productId: string,
  newQuantity: number,
  stockAvailable: number
): boolean => {
  if (newQuantity > stockAvailable) {
    return false;
  }

  const cart = getCart().map((item) =>
    item.product_id === productId ? { ...item, quantity: newQuantity } : item
  );
  saveCart(cart);

  // Dispatch custom event to notify components about cart update
  window.dispatchEvent(new CustomEvent("cartUpdated"));

  return true;
};

// Clear entire cart
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);

  // Dispatch custom event to notify components about cart update
  window.dispatchEvent(new CustomEvent("cartUpdated"));
};
