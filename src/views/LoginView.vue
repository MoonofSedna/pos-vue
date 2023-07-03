<script setup lang="ts">
  import { ref } from "vue";
  // components
  import ShopLayout from "@/components/ShopLayout.vue";
  import Link from "@/components/Link.vue";
  //stores
  import { useAuthStore } from "@/stores/auth";
  // utils
  import { isLoading } from "@/utils";

  const auth = useAuthStore();

  const loading = ref(false);

  const submit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    loading.value = true;
    await auth.login(email, password);
    loading.value = false;
  };
</script>
<template>
  <ShopLayout>
    <div class="container mx-auto py-10 px-4">
      <div class="flex flex-col items-center">
        <div class="md:p-10 w-full xl:w-2/4">
          <Link class="btn" to="home">Go back</Link>

          <div class="bg-white shadow-md rounded-md p-8 mt-6">
            <div class="flex justify-center mb-8">
              <h2 class="pt-2 title">Login</h2>
            </div>
            <h4
              class="bg-red-400 py-2 px-4 text-center mb-6 text-white font-bold rounded-sm"
              v-if="auth.hasError">
              {{ auth.errorMsg }}
            </h4>
            <FormKit
              type="form"
              :disabled="loading"
              :submit-label="isLoading(loading, 'Login')"
              @submit="submit">
              <FormKit
                type="text"
                name="email"
                label="Email"
                placeholder="User Email"
                validation="required|email"
                autocomplete="current-email"
                :validation-messages="{
                  required: 'Email is required',
                  email: 'Field must be a valid email address',
                }" />
              <FormKit
                type="password"
                name="password"
                label="Password"
                placeholder="User Password"
                validation="required"
                autocomplete="current-password"
                :validation-messages="{
                  required: 'Password is required',
                }" />
            </FormKit>
          </div>
        </div>
      </div>
    </div>
  </ShopLayout>
</template>
