import { MapPin, BedDouble, Bath, ArrowUpRight } from 'lucide-react';
import { money } from '../lib/helpers';

export default function ListingCard({ house, onOpen }) {
  const cover = house.photos?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80';
  return <article className="listing-card" onClick={() => onOpen(house)} tabIndex="0" onKeyDown={e => e.key === 'Enter' && onOpen(house)}>
    <div className="listing-image-wrap">
      <img src={cover} alt={house.title} loading="lazy"/>
      <span className="status-pill">Disponible</span>
      <span className="type-pill">{house.category || 'Maison'}</span>
    </div>
    <div className="listing-body">
      <div className="listing-title-row"><h3>{house.title}</h3><ArrowUpRight size={18}/></div>
      <p className="muted location"><MapPin size={15}/>{house.city}{house.neighborhood ? `, ${house.neighborhood}` : ''}</p>
      <div className="listing-features">
        {house.bedrooms != null && <span><BedDouble size={16}/>{house.bedrooms} chambres</span>}
        {house.bathrooms != null && <span><Bath size={16}/>{house.bathrooms} douches</span>}
      </div>
      <div className="price-row"><strong>{money(house.price, house.currency)}</strong><span>/ mois</span></div>
    </div>
  </article>;
}
