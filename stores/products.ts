import { defineStore } from 'pinia';
import type { Product } from '~/types';

export const useProductsStore = defineStore('products', () => {
  const state = reactive({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
  });

  async function fetchProducts() {
    state.loading = true;
    state.error = null;
    try {
      const res = await fetch('/api/products');
      state.products = await res.json();
    } catch (error) {
      state.error = 'Ошибка при загрузке товаров';
    } finally {
      state.loading = false;
    }
  }

  async function addProduct(product: Omit<Product, 'id'>) {
    state.loading = true;
    state.error = null;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (data.id) await fetchProducts();
    } catch (error) {
      state.error = 'Ошибка при добавлении товара';
    } finally {
      state.loading = false;
    }
  }

  async function updateProduct(id: string, updates: Partial<Product>) {
    state.loading = true;
    state.error = null;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      await fetchProducts();
    } catch (error) {
      state.error = 'Ошибка при обновлении товара';
    } finally {
      state.loading = false;
    }
  }

  async function deleteProduct(id: string) {
    state.loading = true;
    state.error = null;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch (error) {
      state.error = 'Ошибка при удалении товара';
    } finally {
      state.loading = false;
    }
  }

  return {
    ...toRefs(state),
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}); 