export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface ReceiptItem {
  id: string;
  bought: Date;
  coffee: {
    id: string;
    name: string;
    price: number;
  };
}
