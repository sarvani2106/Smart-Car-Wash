import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import AuthForm from './AuthForm';

export default function CustomerLogin() {
  return <AuthLayout role="customer" eyebrow="Customer account" title={<>Welcome <em>back.</em></>} footer={<>New to SmartWash? <Link to="/auth/customer/register">Create an account</Link></>}><AuthForm role="customer" customer /></AuthLayout>;
}