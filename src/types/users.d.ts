export interface IUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  role: string;
  passwordChagedAt: Date;
  active: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerified: boolean;
}
