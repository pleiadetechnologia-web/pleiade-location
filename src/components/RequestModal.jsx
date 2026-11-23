import { useState } from 'react';
import { X, Send, LoaderCircle } from 'lucide-react';

const initial = { full_name:'', phone:'', current_address:'', profession:'', occupants:1, desired_date:'', message:'' };

export default function RequestModal({ house, onClose, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!house) return null;
  const change = e => setForm({...form, [e.target.name]:e.target.value});
  async function submit(e) {
    e.preventDefault(); setError('');
    if (busy) return;
    setBusy(true);
    try { await onSubmit(form, house); setForm(initial); }
    catch (err) { setError(err.message || 'Impossible d’envoyer la demande.'); }
    finally { setBusy(false); }
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="form-modal">
      <button className="icon-button modal-close" onClick={onClose}><X/></button>
      <div className="eyebrow">Demande de location</div><h2>Parlons de votre futur logement</h2>
      <p className="muted">Logement sélectionné : <b>{house.title}</b> · {house.city}</p>
      <form onSubmit={submit} className="request-form">
        <label>Nom complet *<input name="full_name" value={form.full_name} onChange={change} required maxLength="120" placeholder="Votre nom complet"/></label>
        <label>Téléphone / WhatsApp *<input name="phone" value={form.phone} onChange={change} required maxLength="30" placeholder="+243..."/></label>
        <label>Adresse actuelle<input name="current_address" value={form.current_address} onChange={change} maxLength="180" placeholder="Votre adresse"/></label>
        <label>Profession<input name="profession" value={form.profession} onChange={change} maxLength="120" placeholder="Votre profession"/></label>
        <div className="form-grid">
          <label>Nombre de personnes<input type="number" min="1" max="50" name="occupants" value={form.occupants} onChange={change}/></label>
          <label>Date souhaitée<input type="date" name="desired_date" value={form.desired_date} onChange={change}/></label>
        </div>
        <label>Message complémentaire<textarea name="message" value={form.message} onChange={change} rows="3" maxLength="1500" placeholder="Précisez votre besoin..."/></label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary full" disabled={busy}>{busy ? <><LoaderCircle className="spin"/> Envoi...</> : <><Send size={17}/> Envoyer ma demande</>}</button>
        <small className="muted">Vos informations seront utilisées uniquement pour traiter votre demande.</small>
      </form>
    </section>
  </div>;
}
