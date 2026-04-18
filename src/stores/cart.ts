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
}

export interface CartActions {
  addToCart: (productId: number, quantity?: number, variationId?: number, variation?: Record<string, string>) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface CartStore extends CartState, CartActions {}

const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8888';

const store = createStore<CartStore>((set, get) => ({
  items: [],
  total: '0',
  isLoading: false,
  error: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  addToCart: async (productId: number, quantity = 1, variationId?: number, variation?: Record<string, string>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${PUBLIC_API_URL}/wp-json/wc/store/v1/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          quantity,
          variation_id: variationId,
          variation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      set({
        items: data.items || [],
        total: data.totals_total || '0',
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
      const response = await fetch(`/wp-json/wc/store/v1/cart/remove-item?key=${key}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      set({
        items: data.items || [],
        total: data.totals_total || '0',
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
      const response = await fetch('/wp-json/wc/store/v1/cart/update-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      const data = await response.json();
      set({
        items: data.items || [],
        total: data.totals_total || '0',
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
      const response = await fetch('/wp-json/wc/store/v1/cart/clear', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      set({
        items: [],
        total: '0',
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
      const response = await fetch('/wp-json/wc/store/v1/cart');

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      set({
        items: data.items || [],
        total: data.totals_total || '0',
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
