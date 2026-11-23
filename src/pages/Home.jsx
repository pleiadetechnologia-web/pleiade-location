import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, MapPin, ArrowRight, Home as HomeIcon, BadgeCheck, HeartHandshake } from 'lucide-react';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import HouseModal from '../components/HouseModal';
import RequestModal from '../components/RequestModal';
import { supabase, isSupabaseConfigured, WHATSAPP_NUMBER } from '../lib/supabase';
import { whatsappUrl } from '../lib/helpers';

export default function Home() {
 const [houses,setHouses]=useState([]);
 const [loading,setLoading]=useState(true);
 const [search,setSearch]=useState('');
 const [category,setCategory]=useState('Tous');
 const [selected,setSelected]=useState(null);
 const [requestHouse,setRequestHouse]=useState(null);
 const [notice,setNotice]=useState('');
 useEffect(()=>{ load(); },[]);
 async function load(){
   if(!isSupabaseConfigured){setHouses([]);setLoading(false);return;}
   const {data,error}=await supabase.from('houses').select('*').eq('status','available').eq('is_published',true).order('created_at',{ascending:false});
   if(error){console.error(error);setNotice('Les logements ne sont pas accessibles pour le moment.');setHouses([]);}
   else setHouses(data||[]);
   setLoading(false);
 }
 const categories=['Tous',...new Set(houses.map(h=>h.category).filter(Boolean))];
 const filtered=useMemo(()=>houses.filter(h=>(category==='Tous'||h.category===category)&&`${h.title} ${h.city} ${h.neighborhood||''}`.toLowerCase().includes(search.toLowerCase())),[houses,category,search]);
 const carouselHouses=filtered.length ? [...filtered,...filtered] : [];
 async function sendRequest(form,house){
   if(!isSupabaseConfigured) throw new Error('Connectez Supabase pour envoyer une demande réelle.');
   const requestToken=crypto.randomUUID();
   const payload={...form,house_id:house.id,request_token:requestToken};
   const {error}=await supabase.from('rental_requests').insert(payload);
   if(error) throw new Error(error.code==='23505'?'Cette demande a déjà été envoyée.':'Erreur lors de l’enregistrement. Réessayez.');
   const message=`NOUVELLE DEMANDE - PLÉIADE LOCATION\nMaison : ${house.title}\nVille : ${house.city}\nPrix : ${house.price} ${house.currency}\nNom : ${form.full_name}\nTéléphone : ${form.phone}\nAdresse : ${form.current_address||'-'}\nProfession : ${form.profession||'-'}\nPersonnes : ${form.occupants}\nDate souhaitée : ${form.desired_date||'-'}\nMessage : ${form.message||'-'}\nRéférence : ${requestToken}`;
   if(WHATSAPP_NUMBER) window.open(whatsappUrl(WHATSAPP_NUMBER,message),'_blank','noopener,noreferrer');
   setRequestHouse(null);setSelected(null);
   setNotice('Votre demande a été enregistrée. Merci !');
 }
 return <><Header/>
  <main>
   <section className="hero">
    <div className="hero-shape shape-one"/><div className="hero-shape shape-two"/>
    <div className="container hero-grid">
     <div className="hero-copy">
      <span className="eyebrow"><span className="pulse-dot"/> VOTRE PROCHAIN CHEZ-VOUS COMMENCE ICI</span>
      <h1>Trouvez un lieu où <span>la vie se construit.</span></h1>
      <p>Explorez des maisons et appartements à louer. Consultez les photos, découvrez les détails et envoyez votre demande en quelques instants.</p>
      <a className="btn btn-primary" href="#logements">Explorer les logements <ArrowRight size={18}/></a>
      <div className="hero-trust"><span><ShieldCheck size={16}/> Demande simple</span><span><BadgeCheck size={16}/> Annonces suivies</span></div>
     </div>
     <div className="hero-visual">
      <div className="hero-photo-main"><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=90" alt="Belle maison moderne"/></div>
      <div className="floating-note"><span className="note-icon"><HomeIcon/></span><div><b>Votre recherche</b><small>Un logement adapté à vos besoins</small></div></div>
      <div className="floating-stamp">PLÉIADE<br/><b>LOCATION</b></div>
     </div>
    </div>
   </section>
   <section className="search-section container">
    <div className="search-box"><Search size={20}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par maison, ville ou quartier..."/><a href="#logements" className="btn btn-primary search-btn">Rechercher</a></div>
   </section>
   <section className="section container" id="logements">
    <div className="section-heading"><div><span className="eyebrow">SÉLECTION PLÉIADE</span><h2>Des logements à découvrir</h2><p className="muted">Trouvez l'espace qui correspond à votre quotidien.</p></div><span className="result-count">{filtered.length} logement(s)</span></div>
    <div className="category-row">{categories.map(c=><button key={c} className={category===c?'category active':'category'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    {notice&&<div className="success-notice">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
    {loading?<div className="loading-state">Chargement des logements...</div>:filtered.length?<><div className="featured-carousel" aria-label="Annonces mises en avant"><div className="featured-track">{carouselHouses.map((h,index)=><button className="featured-slide" key={`${h.id}-${index}`} onClick={()=>setSelected(h)}><img src={h.photos?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80'} alt={h.title} loading="lazy"/><span><b>{h.title}</b><small>{h.city} · {h.neighborhood||'Bukavu'}</small></span></button>)}</div></div><div className="listing-grid">{filtered.map(h=><ListingCard key={h.id} house={h} onOpen={setSelected}/>)}</div></>:<div className="empty-state"><HomeIcon size={34}/><h3>Aucun logement trouvé</h3><p>Essayez une autre recherche ou revenez plus tard.</p></div>}
   </section>
   <section className="how-section" id="comment-ca-marche"><div className="container"><div className="section-heading centered"><div><span className="eyebrow">EN TOUTE SIMPLICITÉ</span><h2>Votre demande en 3 étapes</h2></div></div><div className="steps-grid"><div className="step-card"><span>01</span><Search/><h3>Explorez</h3><p>Parcourez les logements et consultez les détails.</p></div><div className="step-card"><span>02</span><HeartHandshake/><h3>Exprimez votre intérêt</h3><p>Remplissez le formulaire du logement choisi.</p></div><div className="step-card"><span>03</span><BadgeCheck/><h3>Nous vous contactons</h3><p>Notre équipe reçoit votre demande et vous accompagne.</p></div></div></div></section>
  </main>
  <footer className="footer"><div className="container footer-inner"><div className="brand"><img className="brand-logo" src="/icon-192.png" alt="Logo Pléiade Location"/><span>PLÉIADE <b>LOCATION</b></span></div><p>Un logement qui vous ressemble.</p><small>© {new Date().getFullYear()} Pléiade Location. Tous droits réservés.</small></div></footer>
  <HouseModal house={selected} onClose={()=>setSelected(null)} onRequest={h=>{setSelected(null);setRequestHouse(h);}}/>
  <RequestModal house={requestHouse} onClose={()=>setRequestHouse(null)} onSubmit={sendRequest}/>
 </>;
}
