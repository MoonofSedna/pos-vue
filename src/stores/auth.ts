import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { useFirebaseAuth } from "vuefire";
import {
  signInWithEmailAndPassword,
  type Auth,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import type { FirebaseError } from "@firebase/util";

export const useAuthStore = defineStore("auth", () => {
  const auth = useFirebaseAuth() as Auth;
  const authUser = ref<User | null>(null);

  const router = useRouter();

  const errorMsg = ref("");

  const errorCodes = {
    "auth/user-not-found": "User not found",
    "auth/wrong-password": "Wrong password",
  };

  const auntheticateUser = async () => {
    return await new Promise((resolve, reject) => {
      onAuthStateChanged(auth, user => {
        if (!user) {
          reject();
        }
        authUser.value = user;
        resolve(user);
      });
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (!user) return;
      authUser.value = user;
      router.push({ name: "home" });
    } catch (e) {
      const error = e as FirebaseError;
      const errorMessage = error.code as keyof typeof errorCodes;
      errorMsg.value = errorCodes[errorMessage];
    }
  };

  const logout = async () => {
    await auth.signOut();
    authUser.value = null;
    router.push({ name: "login" });
  };

  const hasError = computed(() => errorMsg.value !== "");
  const isAuth = computed(() => authUser.value !== null);
  const userId = computed(() => authUser.value?.uid);

  return {
    login,
    logout,
    isAuth,
    userId,
    hasError,
    errorMsg,
    auntheticateUser,
  };
});
