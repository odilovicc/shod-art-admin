export type UserRole = 'root' | 'it' | 'worker' | 'manager' | 'logistics' | 'smm';

export interface User {
  id: string;
  login: string;
  role: 'root' | 'worker' | 'manager' | 'logistics' | 'smm';
  canEditProducts: boolean;
  canManageLogistics: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ProductForm {
  title: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface UserForm {
  login: string;
  password: string;
  role: User['role'];
  canEditProducts: boolean;
  canManageLogistics: boolean;
} 