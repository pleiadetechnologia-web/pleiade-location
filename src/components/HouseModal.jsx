import { useState } from 'react';
import { X, MapPin, BedDouble, Bath, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { money } from '../lib/helpers';

export default function HouseModal({ house, onClose, onRequest }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  if (!house) return null;
  const media = [...(house.photos || [])];
  if (house.video_url) media.push(house.video_url);
  const current = media[index] || '';
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="house-modal">
      <button className="icon-button modal-close" onClick={onClose}><X/></button>
      <div className="modal-media">
        {current && (index === media.length - 1 && house.video_url
          ? <video src={current} controls playsInline />
          : <img className={zoomed ? 'zoomed-image' : ''} src={current} alt={house.title} onClick={() => setZoomed(!zoomed)} />)}
        {!current && <div className="empty-media">Aucune photo disponible</div>}
        {media.length > 1 && <>
          <button className="gallery-arrow left" onClick={() => setIndex((index - 1 + media.length) % media.length)}><ChevronLeft/></button>
          <button className="gallery-arrow right" onClick={() => setIndex((index + 1) % media.length)}><ChevronRight/></button>
          <span className="gallery-count">{index + 1} / {media.length}</span>
        </>}
        {house.video_url && <span className="video-indicator"><PlayCircle size={15}/> Vidéo incluse</span>}
      </div>
      <div className="modal-content">
        <div className="eyebrow">{house.category || 'Logement'} · Disponible</div>
        <h2>{house.title}</h2>
        <p className="muted"><MapPin size={16}/>{house.city}{house.neighborhood ? `, ${house.neighborhood}` : ''}</p>
        <div className="modal-price">{money(house.price, house.currency)} <small>/ mois</small></div>
        <div className="listing-features large">
          {house.bedrooms != null && <span><BedDouble/>{house.bedrooms} chambres</span>}
          {house.bathrooms != null && <span><Bath/>{house.bathrooms} douches</span>}
        </div>
        <h3>Description</h3><p className="description">{house.description || 'Contactez-nous pour plus de détails sur ce logement.'}</p>
        <button className="btn btn-primary full" onClick={() => onRequest(house)}>Demander cette maison</button>
      </div>
    </section>
  </div>;
}
