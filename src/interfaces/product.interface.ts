interface ProductInterface {
  id: string;
  name: string;
  price: number;
  availability: number;
  image: string;
  category: number;
  user: string;
}

type FileType = {
  name: string;
  file: File;
};

interface ProductForm {
  name: string;
  price: number | null;
  availability: number;
  category: number | null;
  user?: string;
  image: FileType[] | string | null;
}

interface CartInterface extends ProductInterface {
  quantity: number;
}

interface SaleInterface extends CartInterface {
  total: number;
  subtotal: number;
  taxes: number;
  discount: number;
  date: string;
  items: CartInterface[];
}

export type {
  ProductInterface,
  ProductForm,
  CartInterface,
  FileType,
  SaleInterface,
};
