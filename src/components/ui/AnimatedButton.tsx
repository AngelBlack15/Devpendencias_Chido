import React from 'react';

interface AnimatedButtonProps {
  text: string;
  onClick?: () => void;
  color?: string;
  hoverTextColor?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  onClick,
  color = 'greenyellow',
  hoverTextColor = '#212121',
  className = '',
  type = 'button',
}) => {
  // Estilos dinámicos basados en el color
  const buttonStyle = {
    '--button-color': color,
    '--button-hover-text': hoverTextColor,
  } as React.CSSProperties;

  return (
    <button
      type={type}
      className={`animated-button ${className}`}
      onClick={onClick}
      style={buttonStyle}
    >
      <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="text">{text}</span>
      <span className="circle"></span>
      <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
  );
};

export default AnimatedButton;
