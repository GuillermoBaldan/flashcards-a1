import React, { useRef, useState, useLayoutEffect } from 'react';

interface DynamicFontSizeProps {
  text: string;
  maxFontSize?: number;
}

const DynamicFontSize: React.FC<DynamicFontSizeProps> = ({ text, maxFontSize = 110 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const adjustFontSize = () => {
      const containerWidth = container.offsetWidth;
      if (containerWidth === 0) return;

      const textElement = document.createElement('span');
      textElement.style.fontSize = `${maxFontSize}px`;
      textElement.style.whiteSpace = 'nowrap';
      textElement.innerHTML = text;
      document.body.appendChild(textElement);
      const textWidth = textElement.offsetWidth;
      document.body.removeChild(textElement);

      if (textWidth > containerWidth) {
        setFontSize((containerWidth / textWidth) * maxFontSize);
      } else {
        setFontSize(maxFontSize);
      }
    };

    adjustFontSize();

    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [text, maxFontSize]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        fontSize: `${fontSize}px`, 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center' 
      }} 
      dangerouslySetInnerHTML={{ __html: text }} 
    />
  );
};

export default DynamicFontSize;