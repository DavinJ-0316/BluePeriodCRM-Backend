import Document from 'mongoose';

interface Address extends Document {
  street: string;
  city: string;
  state: string;
  postcode: string;
}

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  NOTTOTELL = 'NOTTOTELL',
}

enum Notification {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export interface ICustomer extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob?: Date;
  notification?: Notification;
  gender: Gender;
  address: Address;
  spending?: number;
}
