# DynamicFontSize – ajuste tipográfico automático sin recortes

Este documento describe el componente que ajusta dinámicamente el tamaño de la tipografía para que el contenido quepa en su contenedor sin cortarse por la parte superior o inferior.

Archivo principal: <mcfile name="DynamicFontSize.tsx" path="D:\Glife - Portátil Lenovo\Gproyectos\flashcards-a1\flashcards-a1-frontend\src\components\DynamicFontSize.tsx"></mcfile>

## Objetivo

Evitar el clipping (corte) del texto en los extremos superior e inferior cuando la tarjeta se muestra a pantalla, manteniendo el texto centrado y visible dentro del área útil del contenedor padre.

## API

Props:
- text: string (puede incluir HTML; se inyecta con `dangerouslySetInnerHTML`. Asegúrate de sanitizar en origen si proviene de fuentes externas.)
- maxFontSize?: number = 110
- minFontSize?: number = 16
- verticalPaddingPx?: number = 8  — padding vertical interno del contenedor que añade aire superior/inferior.
- lineHeight?: number = 1.15 — line-height aplicado al texto para estabilidad de medición.
- safetyMarginPx?: number = 1 — margen de seguridad restado al tamaño final para evitar cortes por redondeos.

## Cómo funciona

1) Medición contra el contenedor padre
- Se calcula el ancho/alto útiles del padre con `clientWidth/clientHeight` menos su padding.
- A ese resultado se le resta el padding del contenedor propio del texto para obtener el espacio realmente disponible.
- Si el alto disponible del padre resultara 0 (caso raro), se aplica un “fallback” que ajusta solo por ancho para no bloquear el render.

2) Wrapper interno y estilos estables
- El texto vive dentro de un wrapper interno con estilos pensados para medición coherente: `line-height` fijo (configurable vía prop), `white-space: normal`, `word-break: break-word`, `overflow-wrap: anywhere`, y `text-align: center`.
- El contenedor aporta `padding` vertical configurable (por defecto 8px) para dar aire arriba/abajo y evitar recortes marginales.

3) Búsqueda binaria del tamaño de fuente
- Se explora el rango [minFontSize, maxFontSize] con búsqueda binaria para encontrar el mayor tamaño que cabe tanto por ancho como por alto.
- Se aplica un margen de seguridad configurable (`safetyMarginPx`) al tamaño encontrado para mitigar redondeos métricos de los navegadores.

4) Reajuste reactivo
- Se observan cambios de tamaño con `ResizeObserver` tanto en el padre como en el propio contenedor y también en el `window.resize`.
- El ajuste es O(log(max-min)), con un máximo de ~20 iteraciones, mucho más rápido y estable que reducir píxel a píxel.

## Resultados esperados
- Texto centrado, sin recortes superiores/inferiores, ajustado al alto disponible del padre.
- La barra de progreso permanece visible y no solapa el contenido.

## Ajustes finos (tuning)
- Si hubiera recortes puntuales con glifos extremos:
  - Aumentar `safetyMarginPx` de 1px a 2px.
  - Incrementar `verticalPaddingPx` (p. ej. de 8px a 10–12px).
  - Ajustar `lineHeight` (rango recomendado: 1.12–1.18).
- Estos parámetros ya están expuestos como props para variarlos por tarjeta/uso.

## Consideraciones
- Requiere que el contenedor padre disponga de una altura válida/medible para ajustar por alto.
- No se usa Tailwind en este componente, siguiendo las prácticas del proyecto.
- Para textos extremadamente largos sin espacios, se aplica `overflow-wrap: anywhere` para favorecer el ajuste.

## Comprobación visual
- Validación usada durante el desarrollo: http://localhost:5176/decks/68c9ac8213730f3c545600d7/continuous-test
- HMR aplicó los cambios correctamente y no se observaron errores visuales en la vista.

## Historial
- 2025-09-17 – Opción 1 implementada (medición contra el padre + búsqueda binaria) con margen de seguridad y padding vertical.
- 2025-09-17 – Se exponen como props: `verticalPaddingPx`, `lineHeight` y `safetyMarginPx` para ajuste fino por uso.