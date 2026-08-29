import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import './AuthRoleOptions.css';

const roles = [
	{ id: 'customer', label: 'Customer', login: '/auth/customer/login', register: '/auth/customer/register' },
	{ id: 'provider', label: 'Provider', login: '/auth/provider/login', register: '/auth/provider/register' },
	{ id: 'admin', label: 'Admin', login: '/auth/admin/login' },
];

export default function AuthLayout({ eyebrow, title, children, footer, role, register = false }) {
	return <div className="auth-page"><section className="auth-visual"><Link to="/"><Logo light /></Link><div><p className="eyebrow">DOORSTEP CAR CARE</p><h1>Thoughtful care<br/>for every <em>drive.</em></h1><p>A better way to keep your car looking and feeling its best.</p></div><span className="visual-caption">SMARTWASH / EST. 2026</span></section><section className="auth-content"><Link className="back-link" to="/">← Back to SmartWash</Link><div className="auth-card"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><div className="auth-role-options" aria-label="Choose account type">{roles.map((item) => <Link key={item.id} className={item.id === role ? 'active' : ''} to={(register && item.register) || item.login}>{item.label}</Link>)}</div>{children}{footer && <p className="auth-footer">{footer}</p>}</div></section></div>;
}
