export type CartItemView = {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  category: string;
  variantId: string;
  sku: string;
  color: string;
  size: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  compareAtPrice: number | null;
  lineTotal: number;
  maxQuantity: number;
};

export type CartView = {
  id: string | null;
  items: CartItemView[];
  itemCount: number;
  subtotal: number;
  total: number;
  isAuthenticated: boolean;
  guestSessionToken: string | null;
};

export type CartActionResult = {
  success: boolean;
  message: string;
  cart: CartView;
  error?: string;
};
