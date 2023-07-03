import { computed } from "vue";

const isLoading = computed(() => {
  return (loading: boolean, text: string) => (loading ? "Loading..." : text);
});

const categories = [
  {
    id: 1,
    name: "Makeup",
  },
  {
    id: 2,
    name: "Skin Care",
  },
  {
    id: 3,
    name: "Hair Care",
  },
];

const adminLinks = [
  {
    name: "Sales",
    to: "sales",
  },
  {
    name: "Products",
    to: "products",
  },
];

const shopLinks = [
  {
    name: "Shop",
    to: "home",
  },
];

const categoryOptions = computed(() => {
  return [
    {
      label: "Select Category",
      value: "",
      attrs: {
        disabled: true,
      },
    },
    ...categories.map(category => {
      return {
        value: category.id,
        label: category.name,
      };
    }),
  ];
});

const formatCurrency = (price: number) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const formatCategory = computed(() => {
  return (category: number) => {
    return categories.find(cat => cat.id === category)?.name;
  };
});

const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
};

export {
  isLoading,
  categories,
  adminLinks,
  shopLinks,
  categoryOptions,
  formatCurrency,
  formatCategory,
  getCurrentDate,
};
