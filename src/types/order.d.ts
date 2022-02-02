import Document from 'mongoose';

export interface IProduct {
  sku: string;
  productName: string;
  quantity: number;
  price: number;
  description?: string;
}
interface Address extends Document {
  street: string;
  city: string;
  state: string;
  postcode: string;
}
export interface ICustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

enum orderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

export default interface IOrder extends Document {
  orderId: string;
  customerInfo: ICustomerInfo;
  products: IProduct[];
  dateCreated: Date;
  invoiceId?: string;
  status: orderStatus;
}
