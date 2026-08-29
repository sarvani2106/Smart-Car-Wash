import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import AuthForm from './AuthForm';

export default function ProviderLogin() {
  return <AuthLayout role="provider" eyebrow="Service provider account" title={<>Welcome <em>back.</em></>} footer={<>Need an account? <Link to="/auth/provider/register">Register as a provider</Link></>}><AuthForm role="provider" /></AuthLayout>;
}