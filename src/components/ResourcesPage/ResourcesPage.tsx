//rc/components/ResourcesPage/ResourcesPage.tsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../ui/AnimatedButton';
import LoginForm from '../auth/LoginForm';
import './ResourcesPage.css';

const API_BASE = 'http://localhost:3000/api';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  visits: number;
  likes: number;
  isLiked: boolean;
  image: string;
  tags: string[];
}

// Importar imágenes (asegúrate de tener estas imágenes en tu proyecto)
const logo = '/devpendenciasIMG/logobros.svg';
const icon1 = '/devpendenciasIMG/program.svg';
const icon2 = '/devpendenciasIMG/monitor.svg';

// Datos de ejemplo para las etiquetas
const tags = [
  'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Django',
  'Vue', 'Angular', 'Svelte', 'Next.js', 'NestJS', 'Express',
  'MongoDB', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'Git'
];

const ResourcesPage: React.FC = () => {
  const [postsData, setPostsData] = useState<Post[]>([]);
  
  const handleContactClick = () => {
    console.log('Contact button clicked');
  };

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

// Al montar, traemos los links desde tu API
useEffect(() => {
  fetch(`${API_BASE}/links`)
    .then(res => {
      if (!res.ok) throw new Error(`Error al cargar links (${res.status})`);
      return res.json();
    })
    .then((links: any[]) => {
      const mapped: Post[] = links.map((l) => ({
        id:      l._id,                                                // string
        title:   l.title,
        excerpt: (l.description || '').slice(0, 100) + '...',          // toma los primeros 100 caracteres
        date:    new Date(l.createdAt || Date.now()).toLocaleDateString(),
        visits:  typeof l.visits === 'number' ? l.visits : 0,         // fallback a 0
        likes:   typeof l.likes  === 'number' ? l.likes  : 0,         // fallback a 0
        isLiked: false,                                               // controla localmente
        image:   l.image ? l.image : '/devpendenciasIMG/placeholder.png',
        tags:    Array.isArray(l.tags) ? l.tags : [l.tags || 'Sin categoría']
      }));
      setPostsData(mapped);
    })
    .catch(err => {
      console.error('Error cargando posts:', err);
      // opcional: mostrar alerta al usuario
    });
}, []);


  // Función para verificar la posición del scroll
  const checkScrollPosition = () => {
    if (row1Ref.current && row2Ref.current) {
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      
      // Verificar si estamos al inicio
      const atStart = row1.scrollLeft === 0 && row2.scrollLeft === 0;
      
      // Verificar si estamos al final
      const atEnd = 
        row1.scrollLeft + row1.clientWidth >= row1.scrollWidth - 5 &&
        row2.scrollLeft + row2.clientWidth >= row2.scrollWidth - 5;
      
      setIsAtStart(atStart);
      setIsAtEnd(atEnd);
    }
  };

  // Función para desplazarse a la izquierda
  const scrollLeft = () => {
    if (row1Ref.current && row2Ref.current) {
      const scrollAmount = 200; // Cantidad de píxeles a desplazar
      row1Ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      row2Ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      
      // Verificar la posición después de un pequeño retraso
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Función para desplazarse a la derecha
  const scrollRight = () => {
    if (row1Ref.current && row2Ref.current) {
      const scrollAmount = 200; // Cantidad de píxeles a desplazar
      row1Ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      row2Ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Verificar la posición después de un pequeño retraso
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Manejar el evento de scroll
  const handleScroll = () => {
    checkScrollPosition();
  };

  const handlePublishClick = () => {
    console.log('Publish button clicked');
    setShowLoginForm(true);
  };
const viewDetails = async (postId: string) => {
  const post = postsData.find(p => p.id === postId);
  if (!post) return;
  const newVisits = post.visits + 1;

  // 1) Actualizar visits en la DB
  await fetch(`${API_BASE}/links/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visits: newVisits })
  });

  // 2) Actualizar localmente
  setPostsData(current =>
    current.map(p =>
      p.id === postId
        ? { ...p, visits: newVisits }
        : p
    )
  );

  // 3) Luego puedes redirigir / mostrar detalles
  // navigate(`/links/${postId}`); // si usas react-router
};

  const handleCloseLoginForm = () => {
    setShowLoginForm(false);
  };
  
const toggleLike = async (postId: string) => {
  const post = postsData.find(p => p.id === postId);
  if (!post) return;
  const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;

  const res = await fetch(`${API_BASE}/links/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: newLikes })
  });
  if (!res.ok) {
    console.error('Error actualizando likes');
    return;
  }
  setPostsData(current =>
    current.map(p =>
      p.id === postId
        ? { ...p, likes: newLikes, isLiked: !p.isLiked }
        : p
    )
  );
};

  return (
    <div className="resources-container">
      {/* Header */}
      <header className="resources-header">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/vite.svg';
            }} />
          </Link>
        </div>
        <div className="header-buttons">
          <AnimatedButton 
            text="Publicar" 
            onClick={handlePublishClick}
            color="#232122"
            hoverTextColor="#ffffff"
            className="publish-button"
          />
          <AnimatedButton 
            text="Contáctanos" 
            onClick={handleContactClick}
            color="#232122"
            hoverTextColor="#ffffff"
            className="contact-button"
          />
        </div>
      </header>

      {/* Formulario de inicio de sesión */}
      {showLoginForm && <LoginForm onClose={handleCloseLoginForm} />}

      <main className="resources-main">
        {/* Título con iconos */}
        <div className="resources-title-container">
          <img src={icon1} alt="" className="title-icon" />
          <h1 className="resources-title">
            <span className="dev-text">DEV</span>pendencias
          </h1>
          <img src={icon2} alt="" className="title-icon" />
        </div>

        {/* Barra de búsqueda */}
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar..."
          />
        </div>

        {/* Carrusel de etiquetas */}
        <div className="tags-carousel-container">
          <button 
            className={`carousel-arrow prev-arrow ${isAtStart ? 'disabled' : ''}`} 
            aria-label="Anterior"
            onClick={scrollLeft}
            disabled={isAtStart}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="tags-carousel">
            <div 
              className="tags-row" 
              ref={row1Ref} 
              onScroll={handleScroll}
            >
              {tags.slice(0, Math.ceil(tags.length / 2)).map((tag, index) => (
                <button 
                  key={index} 
                  className="tag"
                  onClick={() => console.log(`Tag seleccionado: ${tag}`)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div 
              className="tags-row" 
              ref={row2Ref} 
              onScroll={handleScroll}
            >
              {tags.slice(Math.ceil(tags.length / 2)).map((tag, index) => (
                <button 
                  key={index + Math.ceil(tags.length / 2)} 
                  className="tag"
                  onClick={() => console.log(`Tag seleccionado: ${tag}`)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className={`carousel-arrow next-arrow ${isAtEnd ? 'disabled' : ''}`} 
            aria-label="Siguiente"
            onClick={scrollRight}
            disabled={isAtEnd}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Grid de posts */}
        <div className="posts-grid">
          {postsData.map((post) => (
            <article key={post.id} className="post-card">
              {/* Imagen de vista previa */}
              <div className="post-image-container">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="post-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible';
                  }}
                />
              </div>
              
              <div className="post-content">
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="like-button-wrapper">
                    <input 
                      id={`heart-${post.id}`} 
                      type="checkbox" 
                      checked={post.isLiked}
                      onChange={() => toggleLike(post.id)}
                    />
                    <label className="like" htmlFor={`heart-${post.id}`}>
                      <svg
                        className="like-icon"
                        fillRule="nonzero"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                        ></path>
                      </svg>
                      <span className="like-text">Likes</span>
                    </label>
                    <span className="like-count one">{post.likes - (post.isLiked ? 1 : 0)}</span>
                    <span className="like-count two">{post.likes}</span>
                  </div>
                </div>
                
                <div className="post-meta">
                  <span className="post-date">{post.date}</span>
                  <span className="post-visits">• {post.visits.toLocaleString()} visitas</span>
                </div>
                
                <p className="post-excerpt">{post.excerpt}</p>
                
                <div className="post-tags">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="post-tag">{tag}</span>
                  ))}
                </div>
                
                 <button 
   className="details-button"
   onClick={() => viewDetails(post.id)}
 >
   Ver detalles
 </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
