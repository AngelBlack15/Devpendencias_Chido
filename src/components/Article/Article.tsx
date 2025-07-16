// src/components/Article/Article.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './Article.css';

interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  url: string;
}

const API_BASE = 'http://localhost:3000/api';

const Article: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(state?.post || null);

  // Si no venía en state, lo buscamos por ID
  useEffect(() => {
    if (!post && params.id) {
      fetch(`${API_BASE}/links/${params.id}`)
        .then(res => res.json())
        .then((l: any) => {
          setPost({
            id: l._id,
            title: l.title,
            description: l.description,
            image: l.image || '/devpendenciasIMG/placeholder.png',
            tags: Array.isArray(l.tags) ? l.tags : [l.tags || 'Sin categoría'],
            url: l.url
          });
        })
        .catch(console.error);
    }
  }, [params.id, post]);

  if (!post) return <p>Cargando artículo…</p>;

  const handleBackToResources = () => {
    navigate('/recursos');
  };

  const handleContactClick = () => {
    console.log('Contacto clickeado');
  };

  return (
    <div className="article-container">
      <header className="article-header">
        <div className="logo-container" onClick={handleBackToResources}>
          <img 
            src="/logo-brosvalley.png" 
            alt="BrosValley Logo" 
            className="article-logo"
          />
        </div>
        <button className="contact-button" onClick={handleContactClick}>
          Contáctanos
        </button>
      </header>

      <main className="article-content">
        <h1 className="article-title">{post.title}</h1>
        
        <div className="article-tags">
          {post.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>

        <div className="article-description">
          <p>{post.description}</p>
        </div>

        {post.image && (
          <div className="article-image-container">
            <img 
              src={post.image} 
              alt={post.title} 
              className="article-image"
            />
          </div>
        )}

        <div className="article-actions">
          <a 
            href={post.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="visit-button"
          >
            Visitar herramienta
          </a>
        </div>
      </main>
    </div>
  );
};

export default Article;
