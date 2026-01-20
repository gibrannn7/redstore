import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { RegisterForm } from '../features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div>
        <h2 className="font-heading text-2xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Join RedStore today
        </p>

        {/* Panggil Feature Component */}
        <RegisterForm />

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