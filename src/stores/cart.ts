import { createStore } from 'zustand/vanilla';

export interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  price: string;
  product_id: number;
  variation_id?: number;
  variation?: Record<string, string>;
}

export interface CartState {
  items: CartItem[];
  total: string;
  isLoading: boolean;
  error: string | null;
  cartToken: string | null;
  nonce: string | null;
}

export interface CartActions {
  addToCart: (productId: number, quantity?: number, variationId?: number, variation?: Array<{attribute: string, value: string}>) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface CartStore extends CartState, CartActions {}

const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8888';

// Function to get nonce from WordPress
const getNonce = async (): Promise<string | null> => {
  try {
    // Try to get nonce from the cart endpoint first
    const response = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/cart`);
    const data = await response.json();

    // Check if nonce is in the response
    if (data.nonce) {
      return data.nonce;
    }

    // If not, try the store API nonce endpoint
    const nonceResponse = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/nonce`);
    const nonceData = await nonceResponse.json();
    return nonceData.nonce || null;
  } catch (error) {
    console.error('Failed to fetch nonce:', error);
    return null;
  }
};

const store = createStore<CartStore>((set, get) => ({
  items: [],
  total: '0',
  isLoading: false,
  error: null,
  cartToken: null,
  nonce: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  addToCart: async (productId: number, quantity = 1, variationId?: number, variation?: Array<{attribute: string, value: string}>) => {
    set({ isLoading: true, error: null });

    try {
      const { cartToken, nonce } = get();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (cartToken) {
        headers['Cart-Token'] = cartToken;
      }

      if (nonce) {
        headers['X-WC-Store-API-Nonce'] = nonce;
      }

      const payload = {
          id: productId,
          quantity,
          ...(variation && { variation }),
        };

      const response = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/cart/add-item`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Cart API Error:', response.status, errorData);
        throw new Error(`Failed to add item to cart: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const newCartToken = response.headers.get('Cart-Token');

      console.log('added item to cart', data.items);

      set({
        items: data.items || [],
        total: data.totals_total || '0',
        cartToken: newCartToken || cartToken,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to cart',
        isLoading: false
      });
    }
  },

  removeFromCart: async (key: string) => {
    set({ isLoading: true, error: null });

    try {
      const { cartToken, nonce } = get();
      const headers: Record<string, string> = {};

      if (cartToken) {
        headers['Cart-Token'] = cartToken;
      }

      if (nonce) {
        headers['X-WC-Store-API-Nonce'] = nonce;
      }

      const response = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/cart/remove-item?key=${key}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      const newCartToken = response.headers.get('Cart-Token');

      set({
        items: data.items || [],
        total: data.totals_total || '0',
        cartToken: newCartToken || cartToken,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove from cart',
        isLoading: false
      });
    }
  },

  updateQuantity: async (key: string, quantity: number) => {
    set({ isLoading: true, error: null });

    try {
      const { cartToken, nonce } = get();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (cartToken) {
        headers['Cart-Token'] = cartToken;
      }

      if (nonce) {
        headers['X-WC-Store-API-Nonce'] = nonce;
      }

      const response = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/cart/update-item`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          key,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      const data = await response.json();
      const newCartToken = response.headers.get('Cart-Token');

      set({
        items: data.items || [],
        total: data.totals_total || '0',
        cartToken: newCartToken || cartToken,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update cart',
        isLoading: false
      });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const { cartToken, nonce } = get();
      const headers: Record<string, string> = {};

      if (cartToken) {
        headers['Cart-Token'] = cartToken;
      }

      if (nonce) {
        headers['X-WC-Store-API-Nonce'] = nonce;
      }

      const response = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/cart/clear`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      set({
        items: [],
        total: '0',
        cartToken,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear cart',
        isLoading: false
      });
    }
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const { cartToken } = get();
      const headers: Record<string, string> = {};

      if (cartToken) {
        headers['Cart-Token'] = cartToken;
      }

      const response = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/cart`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      const newCartToken = response.headers.get('Cart-Token');

      console.log('will set items from fetchCart', data.items);

      set({
        items: data.items || [],
        total: data.totals_total || '0',
        cartToken: newCartToken || cartToken,
        nonce: data.nonce || null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch cart',
        isLoading: false
      });
    }
  },
}));

export default store;
