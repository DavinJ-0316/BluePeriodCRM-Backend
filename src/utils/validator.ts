import Product from '@models/products.model';
import { IProduct } from 'order';

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^_&*])[a-zA-Z0-9!@#$%^_&*]{8,32}$/;
  const passwordValidataResult = passwordRegex.test(password);
  return passwordValidataResult;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const emailValidateResult = emailRegex.test(email);
  return emailValidateResult;
};

export { validatePassword, validateEmail };
