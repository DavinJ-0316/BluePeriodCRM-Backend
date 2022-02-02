import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  phone: {
    type: String,
    required: true,
  },
  notification: {
    type: [String],
    enum: ['SMS', 'phone', 'email'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Nottotell'],
    required: true,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: String },
  },
  totalSpent: {
    type: Number,
  },
  orderAccumulation: {
    type: Number,
  },
});
customerSchema.pre('save', async function (next) {
  this.totalSpent = await 0;
  this.orderAccumulation = await 0;
  this.notification = await ['email'];
  next();
});

const Customer = model('Customer', customerSchema);
export default Customer;
