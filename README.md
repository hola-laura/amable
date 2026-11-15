# Amable — sitio estático

El sitio se publica directamente desde la rama `main` en GitHub Pages. No hay compilación ni dependencias de instalación: cada URL corresponde a un archivo HTML estático.

## Dónde editar

- `index.html` y `en/index.html`: portadas en español e inglés.
- Páginas de servicios, proyectos, casos y artículos: archivos HTML en la raíz; sus nombres generan las rutas públicas. Se mantienen así para no cambiar URLs indexadas.
- `site.css`: estilos compartidos de las portadas.
- `css/shared/`: estilos comunes que comparten las páginas internas. Los estilos propios de cada página siguen en su HTML.
- `menu.css` y `menu.js`: navegación y comportamiento del menú.
- `js/page-language-switch.js`: cambio de idioma común de las páginas internas.
- `analytics-consent.js`: consentimiento y carga de analítica.
- `img/`: imágenes y logos.

## Publicación

Los cambios que llegan a `main` activan la publicación de GitHub Pages. Mantén las rutas actuales; si renombras una página, actualiza también sus enlaces, canonical, hreflang y `sitemap.xml`.
