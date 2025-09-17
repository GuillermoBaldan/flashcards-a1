import React, { useRef, useState, useLayoutEffect } from 'react';

interface DynamicFontSizeProps {
  text: string;
  maxFontSize?: number;
  minFontSize?: number;
  // Ajustes finos expuestos como props
  verticalPaddingPx?: number; // padding vertical interno del contenedor
  lineHeight?: number; // line-height aplicado al texto
  safetyMarginPx?: number; // margen de seguridad restado al tamaño final
}

const DynamicFontSize: React.FC<DynamicFontSizeProps> = ({
  text,
  maxFontSize = 110,
  minFontSize = 16,
  verticalPaddingPx = 8,
  lineHeight = 1.15,
  safetyMarginPx = 1,
}) => {
  // Contenedor propio (con padding de seguridad) y wrapper del texto
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = textRef.current;
    if (!container || !content) return;

    // Caja de referencia: el padre (.card-content) si existe, si no, el propio contenedor
    const getMeasureBox = () => {
      const parent = container.parentElement ?? container;

      // Medimos el tamaño de contenido del padre
      const pcs = window.getComputedStyle(parent);
      const pPadTop = parseFloat(pcs.paddingTop || '0');
      const pPadBottom = parseFloat(pcs.paddingBottom || '0');
      const pPadLeft = parseFloat(pcs.paddingLeft || '0');
      const pPadRight = parseFloat(pcs.paddingRight || '0');
      const parentContentWidth = Math.max(0, parent.clientWidth - (pPadLeft + pPadRight));
      const parentContentHeight = Math.max(0, parent.clientHeight - (pPadTop + pPadBottom));

      // Restamos el padding del contenedor propio, porque el texto vive dentro de él
      const ccs = window.getComputedStyle(container);
      const cPadTop = parseFloat(ccs.paddingTop || '0');
      const cPadBottom = parseFloat(ccs.paddingBottom || '0');
      const cPadLeft = parseFloat(ccs.paddingLeft || '0');
      const cPadRight = parseFloat(ccs.paddingRight || '0');

      const usableWidth = Math.max(0, parentContentWidth - (cPadLeft + cPadRight));
      const usableHeight = Math.max(0, parentContentHeight - (cPadTop + cPadBottom));

      return { usableWidth, usableHeight };
    };

    // Ajuste de estilos base para una medición coherente
    const primeStyles = () => {
      content.style.whiteSpace = 'normal';
      content.style.wordBreak = 'break-word';
      (content.style as any).overflowWrap = 'anywhere';
      content.style.lineHeight = `${lineHeight}`;
      content.style.margin = '0';
      content.style.display = 'block';
      content.style.textAlign = 'center';
    };

    const fitsFor = (size: number, considerHeight: boolean) => {
      content.style.fontSize = `${size}px`;
      // Forzamos layout leyendo scroll* después de aplicar el tamaño
      const { usableWidth, usableHeight } = getMeasureBox();
      const widthOk = content.scrollWidth <= Math.floor(usableWidth);
      const heightOk = !considerHeight || content.scrollHeight <= Math.floor(usableHeight);
      return widthOk && heightOk;
    };

    const adjustFontSize = () => {
      primeStyles();
      const { usableHeight } = getMeasureBox();
      const hasHeight = usableHeight > 0;

      // Búsqueda binaria entre min y max, guardando el mejor que cabe
      let lo = Math.max(8, Math.floor(minFontSize));
      let hi = Math.max(lo, Math.floor(maxFontSize));
      let best = lo;
      let iter = 0;
      while (lo <= hi && iter < 20) { // 20 iteraciones son más que suficientes
        const mid = Math.floor((lo + hi) / 2);
        if (fitsFor(mid, hasHeight)) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
        iter++;
      }

      // Margen de seguridad para evitar cortes por redondeos
      const safe = Math.max(minFontSize, best - Math.max(0, Math.floor(safetyMarginPx)));
      content.style.fontSize = `${safe}px`;
      setFontSize(safe);
    };

    adjustFontSize();

    const onResize = () => adjustFontSize();
    window.addEventListener('resize', onResize);

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(onResize);
      ro.observe(container.parentElement ?? container);
      ro.observe(container);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [text, maxFontSize, minFontSize, lineHeight, safetyMarginPx]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: `${verticalPaddingPx}px 0`, // margen de seguridad configurable
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: lineHeight,
          textAlign: 'center',
          width: '100%',
          hyphens: 'auto',
          overflow: 'hidden',
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};

export default DynamicFontSize;