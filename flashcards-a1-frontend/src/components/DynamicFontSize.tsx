import React, { useRef, useState, useLayoutEffect } from 'react';

interface DynamicFontSizeProps {
  text: string;
  maxFontSize?: number;
  minFontSize?: number; // Add minFontSize prop
}

const DynamicFontSize: React.FC<DynamicFontSizeProps> = ({ text, maxFontSize = 110, minFontSize = 16 }) => {
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
      textElement.style.whiteSpace = 'nowrap'; // Keep nowrap for calculation of ideal single-line width
      textElement.innerHTML = text;
      document.body.appendChild(textElement);
      const textWidth = textElement.offsetWidth;
      document.body.removeChild(textElement);

      let newFontSize = maxFontSize;
      if (textWidth > containerWidth) {
        newFontSize = (containerWidth / textWidth) * maxFontSize;
      }
      
      // Ensure font size is not less than minFontSize
      setFontSize(Math.max(newFontSize, minFontSize));
    };

    adjustFontSize();

    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [text, maxFontSize, minFontSize]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        fontSize: `${fontSize}px`, 
        width: '100%', 
        height: '100%', 
        whiteSpace: 'normal', // Allow text to wrap
        wordBreak: 'break-word', // Break long words
        textAlign: 'center' 
      }} 
      dangerouslySetInnerHTML={{ __html: text }} 
    />
  );
};

export default DynamicFontSize;