import { useState, useEffect, useRef } from 'react';

const useAdjustFontSize = (text: string, containerWidth: number, initialFontSize: number = 24) => {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Asegurar estilos base para el cálculo
    el.style.whiteSpace = 'normal';
    el.style.wordBreak = 'break-word';
    el.style.display = el.style.display || 'block';
    el.style.width = '100%';
    el.style.height = el.style.height || '100%';

    // Altura disponible: si el propio elemento no tiene altura fija, toma la del contenedor padre
    const getAvailableSize = () => {
      const parent = el.parentElement;
      const availableWidth = el.clientWidth || parent?.clientWidth || containerWidth || 0;
      const availableHeight = el.clientHeight || parent?.clientHeight || 0;
      return { availableWidth, availableHeight };
    };

    const fits = () => {
      // Ajuste por ancho siempre, por alto sólo si existe altura disponible (>0)
      const { availableHeight } = getAvailableSize();
      const widthOk = el.scrollWidth <= el.clientWidth;
      const heightOk = availableHeight > 0 ? el.scrollHeight <= el.clientHeight : true;
      return widthOk && heightOk;
    };

    const adjust = () => {
      if (!el) return;
      let current = initialFontSize;
      el.style.fontSize = `${current}px`;

      // Si no hay altura disponible (clientHeight=0), hacer ajuste por ancho únicamente
      const { availableHeight } = getAvailableSize();

      let guard = 0;
      while (
        (
          el.scrollWidth > el.clientWidth ||
          (availableHeight > 0 && el.scrollHeight > el.clientHeight)
        ) &&
        current > 10 &&
        guard < 500
      ) {
        current -= 1;
        el.style.fontSize = `${current}px`;
        guard += 1;
      }
      setFontSize(current);
    };

    adjust();

    // Recalcular en resize de ventana y cambios del contenedor
    const onResize = () => adjust();
    window.addEventListener('resize', onResize);

    const roTargets: ResizeObserver[] = [];
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(onResize);
      ro.observe(el);
      roTargets.push(ro);
      if (el.parentElement) {
        const roParent = new ResizeObserver(onResize);
        roParent.observe(el.parentElement);
        roTargets.push(roParent);
      }
    }

    return () => {
      window.removeEventListener('resize', onResize);
      roTargets.forEach((r) => r.disconnect());
    };
  }, [text, containerWidth, initialFontSize]);

  return { fontSize, textRef };
};

export default useAdjustFontSize;
