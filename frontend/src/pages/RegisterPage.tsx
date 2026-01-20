import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/useAuthStore';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
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
    <AuthLayout>
      <div>
        <h2 className="font-heading text-2xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Join RedStore today
        </p>

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

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
          </span>
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
