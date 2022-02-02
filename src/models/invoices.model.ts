import { Schema, model } from 'mongoose';
import IIvoice from 'invoice';
import { product } from './orders.model';

const invoiceSchema = new Schema({
  invoiceId: {
    type: String,
    index: true,
    unique: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  products: [product],
  customerInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postcode: { type: String },
    },
  },
  dateCreated: {
    type: Date,
  },
  dateDue: {
    type: Date,
  },
});

invoiceSchema.pre('save', async function (next) {
  const now: number = await new Date().getTime();
  this.invoiceId = await `INV-${now}`;
  this.dateDue = await now;
  next();
});

const Invoice = model<IIvoice>('Invoice', invoiceSchema);

export default Invoice;
