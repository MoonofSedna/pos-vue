import { ref, computed, watch } from "vue";
import { useFirestore, type _RefFirestore } from "vuefire";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  orderBy,
  QuerySnapshot,
  type DocumentData,
  getDoc,
} from "@firebase/firestore";
// interface
import type { SaleInterface } from "@/interfaces/product.interface";

export default function useSales() {
  const db = useFirestore();
  const sales = ref<SaleInterface[]>([]);
  const date = ref<string>("");

  const getSale = async (id: string) =>
    await getDoc(doc(collection(db, "sales"), id));

  const spreadProducts = (data: QuerySnapshot<DocumentData>) => {
    const productsData = data.docs.map((doc: any) => {
      return { id: doc.id, ...doc.data() };
    });
    return productsData;
  };

  const onDateChange = async () => {
    if (!date.value) {
      sales.value = [];
      return;
    }

    const querySnapshot = query(
      collection(db, "sales"),
      where("date", "==", date.value),
      orderBy("date", "asc")
    );

    const data = await getDocs(querySnapshot);

    const salesData = spreadProducts(data);

    sales.value = salesData;
  };

  watch(date, onDateChange);

  const isDateSelected = computed(() => {
    return date.value;
  });

  const totalSalesOfDay = computed(() => {
    return sales.value.reduce((acc, sale) => {
      return acc + sale.total;
    }, 0);
  });

  return {
    sales,
    date,
    getSale,
    totalSalesOfDay,
    isDateSelected,
    onDateChange,
  };
}
