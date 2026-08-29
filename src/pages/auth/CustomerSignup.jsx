import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import AuthForm from './AuthForm';

export default function CustomerSignup() {
	return <AuthLayout role="customer" register eyebrow="Customer account" title={<>Start your <em>journey.</em></>} footer={<>Already have an account? <Link to="/auth/customer/login">Log in</Link></>}><AuthForm role="customer" register /></AuthLayout>;
}
