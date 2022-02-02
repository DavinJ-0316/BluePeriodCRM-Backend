import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IProduct } from 'products';

const productSchema = new Schema({
  sku: {
    type: String,
    index: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

productSchema.pre('save', async function (next) {
  this.sku = await uuidv4();
  next();
});

export default model<IProduct>('Product', productSchema);
