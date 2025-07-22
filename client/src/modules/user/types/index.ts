export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}
