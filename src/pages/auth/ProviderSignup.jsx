import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import AuthForm from './AuthForm';

export default function ProviderSignup() {
  return <AuthLayout role="provider" register eyebrow="Service provider account" title={<>Grow your <em>business.</em></>} footer={<>Already registered? <Link to="/auth/provider/login">Log in</Link></>}><AuthForm role="provider" register /></AuthLayout>;
}
