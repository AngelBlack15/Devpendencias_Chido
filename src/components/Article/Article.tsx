import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Article.css';

interface ArticleProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  url: string;
}

const Article: React.FC<ArticleProps> = ({ title, description, imageUrl, tags, url }) => {
  const navigate = useNavigate();

  const handleBackToResources = () => {
    navigate('/resources');
  };

  const handleContactClick = () => {
    // Aquí irá la lógica para el botón de contacto
    console.log('Contacto clickeado');
  };

  return (
    <div className="article-container">
      {/* Header con logo y botón de contacto */}
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

      {/* Contenido principal del artículo */}
      <main className="article-content">
        <h1 className="article-title">{title}</h1>
        
        {/* Etiquetas */}
        <div className="article-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>

        {/* Descripción */}
        <div className="article-description">
          <p>{description}</p>
        </div>

        {/* Imagen */}
        {imageUrl && (
          <div className="article-image-container">
            <img 
              src={imageUrl} 
              alt={title} 
              className="article-image"
            />
          </div>
        )}

        {/* Botón de acción */}
        <div className="article-actions">
          <a 
            href={url} 
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
