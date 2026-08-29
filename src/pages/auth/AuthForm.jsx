import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthForm({ role, register = false, customer = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState(customer ? 'email' : 'email');
  const [notice, setNotice] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (customer && mode === 'mobile') {
      navigate('/auth/customer/otp');
      return;
    }
    if (register && role === 'customer') {
      navigate('/auth/customer/otp');
      return;
    }
    login(role);
    navigate(`/${role}/dashboard`);
  }

  function handleForgot() {
    setNotice('A mock reset link has been sent.');
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {customer && <div className="role-tabs auth-tabs"><button type="button" className={mode === 'email' ? 'active' : ''} onClick={() => setMode('email')}>Email</button><button type="button" className={mode === 'mobile' ? 'active' : ''} onClick={() => setMode('mobile')}>Mobile + OTP</button></div>}
      {register && <label>Full name<input required placeholder="Your name" /></label>}
      <label>{mode === 'mobile' ? 'Mobile number' : 'Email'}<input required type={mode === 'mobile' ? 'tel' : 'email'} placeholder={mode === 'mobile' ? '+91 00000 00000' : 'you@example.com'} /></label>
      {register && <label>Phone<input required type="tel" placeholder="+91 00000 00000" /></label>}
      {mode === 'email' && <label>Password<input required type="password" placeholder={register ? 'Create a password' : 'Your password'} /></label>}
      {register && <label>Confirm password<input required type="password" placeholder="Repeat your password" /></label>}
      <button className="button button-solid" type="submit">{register ? 'Create account' : mode === 'mobile' ? 'Send OTP' : 'Sign in'} <span>→</span></button>
      {!register && mode === 'email' && <button className="auth-text-button" type="button" onClick={handleForgot}>Forgot password?</button>}
      {notice && <p className="auth-notice" role="status">{notice}</p>}
    </form>
  );
}
