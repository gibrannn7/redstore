import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { LoginForm } from '../features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout>
      <div>
        <h2 className="font-heading text-2xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

        {/* Panggil Feature Component */}
        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}