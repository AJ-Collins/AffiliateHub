export interface Product {
  _id?: string;
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  amazonUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
}