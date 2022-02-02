import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from 'users';

const UserSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['staff', 'admin'],
    default: 'staff',
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordChagedAt: { type: Date, select: false },

  confirmEmailToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  emailVerified: {
    type: Boolean,
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

UserSchema.pre('save', function (next) {
  this.userId = uuidv4();
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChagedAt = Date.now() - 1000;
  next();
});

UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = model<IUser>('User', UserSchema);

export default User;
