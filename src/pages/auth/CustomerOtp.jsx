import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export default function CustomerOtp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState('');

  function verify(event) {
    event.preventDefault();
    if (code.trim().length < 4) return;
    login('customer');
    navigate('/customer/dashboard');
  }

  return <AuthLayout role="customer" eyebrow="Mobile verification" title={<>Check your <em>phone.</em></>} footer={<>Using email instead? <Link to="/auth/customer/login">Back to login</Link></>}><form className="auth-form" onSubmit={verify}><p className="auth-helper">Enter the mock 4-digit code sent to your mobile number.</p><label>One-time password<input required minLength="4" maxLength="6" inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value)} placeholder="0000" /></label><button className="button button-solid" type="submit">Verify and continue <span>→</span></button></form></AuthLayout>;
}
