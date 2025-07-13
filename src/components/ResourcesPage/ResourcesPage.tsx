import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../ui/AnimatedButton';
import LoginForm from '../auth/LoginForm';
import './ResourcesPage.css';

interface Post {
  id: number;
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

// Datos de ejemplo para los posts
const posts = Array(9).fill(0).map((_, index) => ({
  id: index + 1,
  title: `Título del post ${index + 1}`,
  excerpt: 'Este es un resumen del post que puede tener varias líneas de texto para dar una vista previa del contenido completo que se mostrará en la página de detalles.',
  date: '17 Jun 2023',
  visits: Math.floor(Math.random() * 1000) + 50, // Número aleatorio de visitas
  likes: Math.floor(Math.random() * 100),
  isLiked: false,
  image: `https://picsum.photos/400/200?random=${index}`,
  tags: ['React', 'TypeScript', 'Web Development']
}));

const ResourcesPage: React.FC = () => {
  const [postsData, setPostsData] = useState<Post[]>(posts);
  
  const handleContactClick = () => {
    console.log('Contact button clicked');
  };

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Efecto para verificar la posición inicial del scroll
  useEffect(() => {
    checkScrollPosition();
    // Agregar listener para el evento de redimensionamiento
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
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

  const handleCloseLoginForm = () => {
    setShowLoginForm(false);
  };
  
  const toggleLike = (postId: number) => {
    setPostsData((currentPosts: Post[]) => 
      currentPosts.map((post: Post) => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1 
            } 
          : post
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
                
                <button className="details-button">
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
