import { ref, computed } from "vue";
import { useFirestore, type _RefFirestore, useFirebaseStorage } from "vuefire";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  limit,
  orderBy,
  startAfter,
  QuerySnapshot,
  type DocumentData,
  getDoc,
  getCountFromServer,
  deleteDoc,
  addDoc,
} from "@firebase/firestore";
import { ref as storageRef, deleteObject } from "@firebase/storage";
// interfaces
import type {
  ProductInterface,
  ProductForm,
} from "@/interfaces/product.interface";

export default function useProduct() {
  const db = useFirestore();

  const limitNum = 10;
  const products = ref<ProductInterface[]>([]);
  const userProducts = ref<ProductInterface[]>([]);
  const count = ref(0);
  const loading = ref(false);

  const spreadProducts = (data: QuerySnapshot<DocumentData>) => {
    const productsData = data.docs.map((doc: any) => {
      return { id: doc.id, ...doc.data() };
    });
    return productsData;
  };

  const searchCollection = async ({
    id,
    order,
    filterBy,
    filterValue,
    lastDoc,
  }: {
    id?: string;
    order: string;
    filterBy?: string;
    filterValue?: string | number;
    lastDoc?: number | string;
  }) => {
    const doc = lastDoc ? lastDoc : Date.now().toString();
    const initQuery = query(collection(db, "products"), orderBy(order, "asc"));

    let querySnapshot = query(initQuery);

    if (id && filterBy) {
      querySnapshot = query(
        initQuery,
        where("user", "==", id),
        where(filterBy, "==", filterValue)
      );
    } else if (filterBy) {
      querySnapshot = query(initQuery, where(filterBy, "==", filterValue));
    }
    count.value = (await getCountFromServer(querySnapshot)).data().count;

    return await getDocs(
      query(querySnapshot, startAfter(doc), limit(limitNum))
    );
  };

  const getProducts = async ({
    order,
    lastDoc,
    filterBy,
    filterValue,
  }: {
    order: string;
    lastDoc?: number;
    filterBy?: string;
    filterValue?: string | number;
  }) => {
    loading.value = true;
    const data = await searchCollection({
      lastDoc,
      order,
      filterBy,
      filterValue,
    });

    const productsData = spreadProducts(data);

    products.value = productsData;

    loading.value = false;
  };

  const getUserProducts = async ({
    id,
    order,
    lastDoc,
    filterBy,
    filterValue,
  }: {
    id: string;
    order: string;
    lastDoc?: number;
    filterBy?: string;
    filterValue?: string | number;
  }) => {
    const data = await searchCollection({
      id,
      order,
      filterBy,
      filterValue,
      lastDoc,
    });
    const productsData = spreadProducts(data);

    const products = lastDoc
      ? [...userProducts.value, ...productsData]
      : productsData;

    userProducts.value = products;
  };

  const onPaginateProducts = async ({
    id,
    order,
    lastDoc,
    filterBy,
    filterValue,
  }: {
    id?: string;
    order: string;
    lastDoc?: number | string;
    filterBy?: string;
    filterValue?: string | number;
  }) => {
    const data = await searchCollection({
      id,
      order,
      filterBy,
      filterValue,
      lastDoc,
    });

    const productsData = spreadProducts(data);
    if (id) {
      userProducts.value = [...userProducts.value, ...productsData];
    } else {
      products.value = [...products.value, ...productsData];
    }
  };

  const getRef = (id: string) => doc(db, "products", id);

  const createProduct = async (data: ProductForm) => {
    const docRef = addDoc(collection(db, "products"), data);
    return docRef;
  };

  const getProduct = async (id: string) =>
    await getDoc(doc(collection(db, "products"), id));

  const deleteProduct = async (id: string, imageUrl: string) => {
    const storage = useFirebaseStorage();
    const imageRef = storageRef(storage, imageUrl);
    const productRef = getRef(id);
    if (confirm("Are you sure you want to delete this product?")) {
      await Promise.all([deleteObject(imageRef), deleteDoc(productRef)]);
    }
  };

  const showLoadMore = computed(() => {
    return (products: number, loading: boolean) =>
      products > 0 && products < count.value && !loading;
  });

  return {
    createProduct,
    userProducts,
    getProduct,
    getProducts,
    getUserProducts,
    deleteProduct,
    getRef,
    products,
    limit: limitNum,
    showLoadMore,
    onPaginateProducts,
    loading,
  };
}
