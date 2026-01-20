import axios from '../app/axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone_number?: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    avatar_url?: string;
    roles: string[];
  };
  token: string;
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await axios.post<{ data: AuthResponse }>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterData) => {
    const response = await axios.post<{ data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  logout: async () => {
    await axios.post('/auth/logout');
  },
};
