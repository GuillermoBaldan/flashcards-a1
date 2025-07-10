import { useState, useEffect, useRef } from 'react';

const useAdjustFontSize = (text: string, containerWidth: number, initialFontSize: number = 24) => {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current && containerWidth > 0) {
      let currentFontSize = initialFontSize;
      textRef.current.style.fontSize = `${currentFontSize}px`;

      while (textRef.current.scrollWidth > textRef.current.offsetWidth && currentFontSize > 10) {
        currentFontSize -= 1;
        textRef.current.style.fontSize = `${currentFontSize}px`;
      }
      setFontSize(currentFontSize);
    }
  }, [text, containerWidth, initialFontSize]);

  return { fontSize, textRef };
};

export default useAdjustFontSize;
