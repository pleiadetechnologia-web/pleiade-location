import { Link, NavLink } from 'react-router-dom';
import { House, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="container nav-wrap">
      <Link to="/" className="brand"><img className="brand-logo" src="/icon-192.png" alt="Logo Pléiade Location"/><span>PLÉIADE <b>LOCATION</b></span></Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'nav-links show' : 'nav-links'}>
        <NavLink to="/" onClick={() => setOpen(false)}>Accueil</NavLink>
        <a href="/#logements" onClick={() => setOpen(false)}>Nos logements</a>
        <a href="/#comment-ca-marche" onClick={() => setOpen(false)}>Comment ça marche</a>
        <Link className="admin-link" to="/admin/login" onClick={() => setOpen(false)}><ShieldCheck size={16}/> Administration</Link>
      </nav>
    </div>
  </header>;
}
