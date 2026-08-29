import { Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrandMark({ dark = false }) {
  return <Link className={`brand ${dark ? 'brand-dark' : ''}`} to="/" aria-label="Rinsely home"><span className="brand-icon"><Droplets size={17} strokeWidth={2.5} /></span><span>rinsely</span></Link>;
}
