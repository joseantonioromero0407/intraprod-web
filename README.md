# INTRAPROD Web

Sitio corporativo estático de INTRAPROD y landing independiente de calefones ASTOM B. Usa HTML, CSS y JavaScript nativo y puede alojarse en Vercel, Netlify, Cloudflare Pages, cPanel, Hostinger o cualquier servidor estático.

## Estructura

```text
/
├── index.html
├── calefones/index.html
├── css/style.css
├── js/app.js
├── assets/{icons,images,logos}/
├── robots.txt
└── sitemap.xml
```

Para trabajar localmente, sirve la raíz con un servidor HTTP, por ejemplo `python -m http.server 4173`, y abre `http://localhost:4173/`.

## Contenido comercial

- WhatsApp general: `+591 76697191`.
- WhatsApp ASTOM B: `+591 69900093`.
- Catálogo de tapas: enlaces de Google Drive en `index.html`.
- Catálogo ASTOM B: `data-catalog-src` y CTA de pantalla completa en `calefones/index.html`.

El contacto ASTOM B es intencionalmente distinto. Cambia cada número y mensaje en los HTML sin unificarlos automáticamente.

## Catálogo ASTOM B

El catálogo Canva no forma parte de la carga inicial. `js/app.js` crea un único iframe después de pulsar **Ver catálogo interactivo**. No añadas la URL de Canva a un atributo `src` inicial.

El logotipo web ASTOM B se exportó del PDF oficial proporcionado y está en `assets/logos/astom-b-logo-official.*`. Conserva sus proporciones y colores.

## Analítica y UTM

`js/app.js` centraliza los eventos en `window.IntraprodAnalytics` y conserva durante la sesión `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term`. No almacena datos personales.

Eventos preparados:

- `Contact` y `WhatsAppClick` para WhatsApp.
- `ViewContent` para `/calefones/`.
- `CatalogView` para catálogos.
- `FindLocation` para Google Maps.

Los CTA indican su origen mediante `data-track-source`. Si `fbq` o `gtag` existen, el controlador les envía los eventos automáticamente.

Para activar Meta Pixel, instala el script oficial con el ID real antes de `app.js`. Para GA4, instala `gtag.js` con el ID real. No agregues identificadores de ejemplo. Valida siempre en Preview antes de publicar.

## Dominio y SEO

El dominio actual es `https://intraprod-web.vercel.app`. Cuando exista un dominio corporativo, reemplázalo en:

- canonical, Open Graph y schema de ambos HTML;
- `robots.txt`;
- `sitemap.xml`;
- propiedad de Google Search Console.

Al crear o eliminar páginas reales, actualiza `sitemap.xml`, su `lastmod` y la referencia del sitemap en `robots.txt`.

## Despliegue

La integración Git de Vercel genera Preview Deployments para ramas y producción para `main`. Antes de fusionar, verifica desktop, tablet, iPhone, Android, enlaces, consola, SEO y que Canva no realice solicitudes antes del clic.
