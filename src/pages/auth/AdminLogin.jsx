import AuthLayout from '../../layouts/AuthLayout';
import AuthForm from './AuthForm';

export default function AdminLogin() {
  return <AuthLayout role="admin" eyebrow="Platform administration" title="Secure access."><AuthForm role="admin" /></AuthLayout>;
}