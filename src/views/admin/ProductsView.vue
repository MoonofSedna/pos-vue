<script setup lang="ts">
  import { onMounted, ref, computed } from "vue";
  // components
  import Link from "@/components/Link.vue";
  import AdminProductCard from "@/components/AdminProductCard.vue";
  // composables
  import useProduct from "@/composables/useProduct";
  // stores
  import { useAuthStore } from "@/stores/auth";
  // utils
  import { categories } from "@/utils";

  const auth = useAuthStore();
  const {
    getUserProducts,
    userProducts,
    onPaginateProducts,
    showLoadMore,
    deleteProduct,
  } = useProduct();

  const category = ref("");
  const loading = ref(false);

  const getProducts = async () => {
    await getUserProducts({
      id: auth.userId as string,
      order: "name",
    });
  };

  const onPaginate = async () => {
    const lastDoc = userProducts.value.slice(-1)[0].name;
    const defaultQuery = { id: auth.userId as string, order: "name", lastDoc };
    const query = category.value
      ? { ...defaultQuery, filterBy: "category", filterValue: category.value }
      : defaultQuery;
    await onPaginateProducts(query);
  };

  const filteredProducts = async () => {
    if (category.value) {
      await getUserProducts({
        id: auth.userId as string,
        order: "name",
        filterBy: "category",
        filterValue: category.value,
      });
    } else {
      await getProducts();
    }
  };

  onMounted(async () => {
    loading.value = true;
    await getProducts();
    loading.value = false;
  });

  const showProducts = computed(() => {
    return userProducts.value.length > 0;
  });

  const removeItem = async (id: string, imageUrl: string) => {
    await deleteProduct(id, imageUrl);
    await getProducts();
  };
</script>

<template>
  <div class="flex flex-1 lg:overflow-hidden">
    <div class="flex flex-1 flex-col gap-4 pt-4 md:pt-8 items-start">
      <Link className="btn" to="new-product">New Product</Link>
      <div
        class="mt-2 flex flex-col lg:flex-row items-start gap-10 w-full lg:justify-between">
        <h2 class="title sticky">Products</h2>
        <div class="lg:w-1/3 w-full pr-4">
          <h3 class="font-bold">Category:</h3>
          <select
            id="category"
            v-model="category"
            :onchange="filteredProducts"
            class="w-full border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-pink-400 focus:border-pink-400">
            <option value="">All</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      <div
        class="flex w-full h-full overflow-y-auto flex-col items-start pb-6 scrollbar-container">
        <div
          v-if="showProducts && !loading"
          class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-6 overflow-y-auto py-2 scrollbar-container">
          <AdminProductCard
            v-for="product in userProducts"
            :key="product.id"
            :product="product"
            @delete-item="removeItem" />
        </div>
        <div v-else class="w-full flex justify-center items-center h-[80%]">
          <template v-if="loading">
            <svg
              aria-hidden="true"
              class="w-8 h-8 mr-2 animate-spin fill-pink-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
          </template>
          <h4
            v-else-if="!loading && !showProducts"
            class="md:text-4xl text-2xl font-bold text-center">
            No products
          </h4>
        </div>

        <div
          class="flex justify-center mt-6"
          v-if="showLoadMore(userProducts.length, loading) && showProducts">
          <button
            class="btn"
            :disabled="!userProducts.length"
            @click="onPaginate">
            Load More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
