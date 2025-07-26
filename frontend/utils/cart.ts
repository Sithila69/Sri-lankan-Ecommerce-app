export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  seller: string;
  stock: number;
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
  return true;
};

// Remove item by product_id
export const removeFromCart = (productId: string) => {
  const cart = getCart().filter((item) => item.product_id !== productId);
  saveCart(cart);
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
  return true;
};

// Clear entire cart
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
