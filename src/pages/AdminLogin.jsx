import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, ArrowLeft, House } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AdminLogin(){
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);const navigate=useNavigate();
 async function submit(e){e.preventDefault();setError('');if(!isSupabaseConfigured){setError('Configurez Supabase dans le fichier .env.local.');return;}setBusy(true);const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error){setError('Identifiants incorrects ou compte non autorisé.');return;}navigate('/admin');}
 return <div className="auth-page"><Link to="/" className="back-home"><ArrowLeft size={17}/> Retour au site</Link><div className="auth-card"><div className="auth-logo"><House size={28}/></div><span className="eyebrow">ESPACE SÉCURISÉ</span><h1>Administration</h1><p className="muted">Connectez-vous pour gérer Pléiade Location.</p><form onSubmit={submit} className="request-form"><label><span><Mail size={15}/> Adresse e-mail</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="admin@exemple.com"/></label><label><span><LockKeyhole size={15}/> Mot de passe</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Votre mot de passe"/></label>{error&&<p className="error-text">{error}</p>}<button className="btn btn-primary full" disabled={busy}>{busy?'Connexion...':'Se connecter'}</button></form><small className="muted">Accès réservé à l'administrateur autorisé.</small></div></div>;
}
