import { Link } from 'react-router-dom';
export default function Logo({ light = false }) { return <Link className={`logo ${light ? 'logo-light' : ''}`} to="/"><span className="logo-mark">S</span><span>SMART<span>WASH</span></span></Link>; }
