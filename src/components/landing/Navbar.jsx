import { Link } from 'react-router-dom'; import Logo from '../common/Logo';
export default function Navbar() { return <header className="navbar"><Logo /><nav><a href="#services">Services</a><a href="#process">How it works</a><a href="#access">Account</a></nav><Link className="nav-cta" to="/customer/login">Sign in <span>↗</span></Link></header>; }
