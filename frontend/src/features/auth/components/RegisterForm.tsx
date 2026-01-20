import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Perhatikan path import ini (naik 3 level dari features/auth/components ke src)
import { authService } from '../../../services/authService';
import { useAuthStore } from '../../../stores/useAuthStore';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Registration successful!');
      navigate('/');
    },
    onError: (error: any) => {
      const errors = error.response?.data?.errors;
      if (errors) {
        // Menampilkan pesan error validasi dari backend Laravel
        Object.values(errors).forEach((err: any) => {
          toast.error(err[0]);
        });
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Input
        label="Phone Number (Optional)"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone_number}
        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={formData.password_confirmation}
        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        Create Account
      </Button>
    </form>
  );
};