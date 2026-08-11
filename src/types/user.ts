export type UserRole = 'customer' | 'corporate' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  createdAt: unknown;
  updatedAt: unknown;
}