import { Document } from 'mongoose';
import { IProduct, ICustomerInfo } from 'order';

export default interface IInvoice {
  invoiceId: string;
  orderId: string;
  dateCreated: Date;
  dateDue: Date;
  product: IProduct;
  customerInfo: ICustomerInfo;
}
