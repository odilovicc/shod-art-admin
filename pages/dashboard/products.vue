<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProductsStore } from '~/stores/products';
import { useAuthStore } from '~/stores/auth';
import type { Product, ProductForm } from '~/types';

const productsStore = useProductsStore();
const authStore = useAuthStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingProductId = ref<string | null>(null);
const search = ref('');
const category = ref('all');
const status = ref('all');
const sort = ref('title');
const sortOrder = ref<'asc' | 'desc'>('asc');

const categories = ref([
  { label: 'Все категории', value: 'all' },
  { label: 'Одежда', value: 'clothes' },
  { label: 'Аксессуары', value: 'accessories' },
  { label: 'Другое', value: 'other' },
]);
const statuses = ref([
  { label: 'Все', value: 'all' },
  { label: 'В наличии', value: 'in' },
  { label: 'Нет в наличии', value: 'out' },
]);

const productForm = ref<ProductForm>({
  title: '',
  description: '',
  price: 0,
  quantity: 0,
  image_url: '',
});

onMounted(() => {
  productsStore.fetchProducts();
});

const filteredProducts = computed(() => {
  let items = productsStore.products || [];
  if (status.value !== 'all') {
    items = items.filter(p =>
      status.value === 'in' ? p.quantity > 0 : p.quantity === 0
    );
  }
  if (search.value) {
    items = items.filter(p =>
      p.title.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  items = [...items].sort((a, b) => {
    let res = 0;
    if (sort.value === 'title') {
      res = a.title.localeCompare(b.title);
    } else if (sort.value === 'price') {
      res = a.price - b.price;
    } else if (sort.value === 'quantity') {
      res = a.quantity - b.quantity;
    }
    return sortOrder.value === 'asc' ? res : -res;
  });
  return items;
});

function resetForm() {
  productForm.value = {
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    image_url: '',
  };
}

async function handleAddProduct() {
  await productsStore.addProduct({
    ...productForm.value,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  showAddModal.value = false;
  resetForm();
}

function editProduct(product: Product) {
  editingProductId.value = product.id;
  productForm.value = {
    title: product.title,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    image_url: product.image_url,
  };
  showEditModal.value = true;
}

async function handleEditProduct() {
  if (editingProductId.value) {
    await productsStore.updateProduct(editingProductId.value, productForm.value);
    showEditModal.value = false;
    resetForm();
    editingProductId.value = null;
  }
}

async function deleteProduct(id: string) {
  if (confirm('Вы уверены, что хотите удалить этот товар?')) {
    await productsStore.deleteProduct(id);
  }
}

async function decreaseQuantity(product: Product) {
  if (product.quantity > 0) {
    await productsStore.updateProduct(product.id, {
      quantity: product.quantity - 1,
    });
  }
}

function getStatus(quantity: number) {
  return quantity > 0 ? 'В наличии' : 'Нет в наличии';
}
function getStatusColor(quantity: number) {
  return quantity > 0 ? 'bg-[#E9F9EC] text-[#22C55E]' : 'bg-[#F9E9E9] text-[#F43F5E]';
}
</script>

<template>
  <div class="products-page">
    <!-- Шапка -->
    <div class="products-header">
      <h1 class="products-title">Товары</h1>
      <AppButton
        v-if="authStore.hasPermission('canEditProducts')"
        @click="showAddModal = true"
      >
        + Новый товар
      </AppButton>
    </div>
    <!-- Фильтры -->
    <div class="products-filters">
      <input
        v-model="search"
        type="text"
        placeholder="Поиск по названию..."
        class="products-search"
      />
      <select v-model="category" class="products-select">
        <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
      </select>
      <select v-model="status" class="products-select">
        <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
      <select v-model="sort" class="products-select">
        <option value="title">По названию</option>
        <option value="price">По цене</option>
        <option value="quantity">По остатку</option>
      </select>
      <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="products-sort-btn">
        {{ sortOrder === 'asc' ? '↑' : '↓' }}
      </button>
    </div>
    <!-- Пустое состояние -->
    <div v-if="productsStore.loading" class="products-loading">
      <div class="products-spinner"></div>
      <span class="products-loading-text">Загрузка товаров...</span>
    </div>
    <div v-else-if="filteredProducts.length === 0" class="products-empty">
      <div class="products-empty-icon"></div>
      <div class="products-empty-title">Нет добавленных товаров</div>
      <div class="products-empty-desc">Добавьте первый товар, чтобы начать работу</div>
      <button
        v-if="authStore.hasPermission('canEditProducts')"
        @click="showAddModal = true"
        class="products-add-btn"
      >
        + Добавить первый товар
      </button>
    </div>
    <!-- Таблица товаров -->
    <div v-else class="products-table-wrapper">
      <table class="products-table">
        <thead>
          <tr>
            <th>Фото</th>
            <th>Название</th>
            <th>ID</th>
            <th>Остаток</th>
            <th>Статус</th>
            <th>Цена</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" class="products-row">
            <td><img :src="product.image_url" :alt="product.title" class="products-img" /></td>
            <td>
              <div class="products-title-main">{{ product.title }}</div>
              <div class="products-desc">{{ product.description }}</div>
            </td>
            <td class="products-id">{{ product.id }}</td>
            <td class="products-qty">{{ product.quantity }}</td>
            <td>
              <span :class="['products-status', product.quantity > 0 ? 'products-status--in' : 'products-status--out']">
                {{ getStatus(product.quantity) }}
              </span>
            </td>
            <td class="products-price">{{ product.price }} ₽</td>
            <td class="products-actions">
              <AppButton
                v-if="authStore.hasPermission('canEditProducts')"
                @click="editProduct(product)"
                variant="secondary-purple"
              >
                Редактировать
              </AppButton>
              <AppButton
                v-if="authStore.hasPermission('canEditProducts')"
                @click="deleteProduct(product.id)"
                variant="danger"
              >
                Удалить
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Модальное окно добавления/редактирования товара -->
    <div v-if="showAddModal || showEditModal" class="products-modal-overlay">
      <div class="products-modal">
        <h2 class="products-modal-title">{{ showAddModal ? 'Добавить товар' : 'Редактировать товар' }}</h2>
        <form @submit.prevent="showAddModal ? handleAddProduct() : handleEditProduct()">
          <div class="products-modal-fields">
            <div>
              <label class="products-modal-label">Название</label>
              <input v-model="productForm.title" type="text" required class="products-modal-input" />
            </div>
            <div>
              <label class="products-modal-label">Описание</label>
              <textarea v-model="productForm.description" required class="products-modal-input" rows="3"></textarea>
            </div>
            <div>
              <label class="products-modal-label">Цена</label>
              <input v-model.number="productForm.price" type="number" required min="0" class="products-modal-input" />
            </div>
            <div>
              <label class="products-modal-label">Количество</label>
              <input v-model.number="productForm.quantity" type="number" required min="0" class="products-modal-input" />
            </div>
            <div>
              <label class="products-modal-label">URL изображения</label>
              <input v-model="productForm.image_url" type="url" required class="products-modal-input" />
            </div>
          </div>
          <div class="products-modal-actions">
            <AppButton
              type="button"
              @click="() => { showAddModal = false; showEditModal = false; resetForm(); }"
              variant="outline"
            >
              Отмена
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
            >
              {{ showAddModal ? 'Сохранить' : 'Обновить' }}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style src="~/assets/css/pages/products.css"></style> 