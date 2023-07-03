<script setup lang="ts">
  import { computed, onMounted, reactive, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { updateDoc } from "@firebase/firestore";
  // components
  import Link from "@/components/Link.vue";
  // composables
  import useImage from "@/composables/useImage";
  import useProduct from "@/composables/useProduct";
  // interfaces
  import {
    type FileType,
    type ProductForm,
    type ProductInterface,
  } from "@/interfaces/product.interface";
  // stores
  import { useAuthStore } from "@/stores/auth";
  // utils
  import { isLoading, categoryOptions } from "@/utils";

  const router = useRouter();
  const route = useRoute();

  const auth = useAuthStore();

  const { createProduct, getProduct, getRef } = useProduct();
  const { uploadImage, onPreview, imagePreview } = useImage();

  const loading = ref(false);

  const formValues = reactive<ProductForm>({
    name: "",
    price: null,
    availability: 1,
    image: null,
    category: null,
  });

  const addProduct = async (formValues: ProductForm) => {
    loading.value = true;
    const { image, ...rest } = formValues;

    const [file] = image as FileType[];

    const url = file && (await uploadImage(file.file));

    if (isEditing.value) {
      const propertyRef = getRef(id.value);
      const data = url
        ? {
            ...rest,
            image: url,
          }
        : {
            ...rest,
          };

      await updateDoc(propertyRef, data);

      router.push({ name: "products" });
    } else {
      if (!url || !auth.userId) {
        loading.value = false;
        return;
      }

      const docRef = await createProduct({
        ...rest,
        image: url,
        user: auth.userId,
      });

      if (docRef) {
        router.push({ name: "products" });
      }
    }
    loading.value = false;
  };

  const product = ref<ProductInterface | null>(null);

  const id = computed(() => route.params.id as string);
  const isEditing = computed(() => !!id.value);
  const title = computed(() =>
    isEditing.value ? "Edit Product" : "New Product"
  );
  const buttonLabel = computed(() =>
    isEditing.value ? "Update Product" : "Add Product"
  );

  onMounted(async () => {
    if (id.value) {
      loading.value = true;
      const propertyRef = (await getProduct(id.value)).data();
      product.value = propertyRef as ProductInterface;
      loading.value = false;
    }
  });

  watch(product, product => {
    if (product) {
      formValues.name = product.name;
      formValues.price = product.price;
      formValues.availability = product.availability;
      formValues.category = product.category;
    }
  });
</script>
<template>
  <div class="flex flex-col items-center">
    <div class="md:p-10 w-full xl:w-2/4">
      <Link class="btn" to="products">Go back</Link>

      <div class="bg-white shadow-md rounded-md p-8 mt-6">
        <div class="flex justify-center mb-8">
          <h2 class="pt-2 title">{{ title }}</h2>
        </div>
        <FormKit
          type="form"
          :submit-label="isLoading(loading, buttonLabel)"
          :disabled="loading"
          @submit="addProduct"
          :value="formValues">
          <FormKit
            type="text"
            name="name"
            label="Name"
            placeholder="Product Name"
            v-model.trim="formValues.name"
            validation="required|length:3"
            :validation-messages="{
              required: 'Product name is required',
              length: 'Product name must be at least 3 characters',
            }" />

          <FormKit
            type="number"
            name="price"
            label="Price"
            placeholder="Product Price"
            validation="required|number|min:1"
            min="1"
            step="0.01"
            v-model.number="formValues.price"
            :validation-messages="{
              required: 'Product price is required',
              min: 'Product price must be at least $1',
            }" />

          <FormKit
            type="number"
            name="availability"
            label="Available Quantity"
            placeholder="Product Quantity"
            validation="required|number|min:1"
            min="1"
            v-model.number="formValues.availability"
            :validation-messages="{
              required: 'Product availability is required',
              min: 'Product availability must be at least 1',
            }" />

          <FormKit
            type="file"
            name="image"
            label="Image"
            :validation="isEditing ? '' : 'required'"
            @change="onPreview"
            v-model.trim="formValues.image"
            :validation-messages="{ required: 'Product image is required' }"
            accept=".jpg,.png,.jpeg, .webp" />

          <div v-if="imagePreview || product?.image" class="ml-5 mt-2">
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Property Image"
              width="80" />
            <img
              v-else-if="product?.image"
              :src="product?.image"
              alt="Property Image"
              width="80" />
          </div>

          <FormKit
            type="select"
            name="category"
            label="Category"
            placeholder="Product Category"
            validation="required"
            v-model="formValues.category"
            :options="categoryOptions"
            :validation-messages="{
              required: 'Product category is required',
            }" />
        </FormKit>
      </div>
    </div>
  </div>
</template>
