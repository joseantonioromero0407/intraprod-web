# INTRAPROD Web

Sitio corporativo estático de INTRAPROD, importadora y distribuidora con atención en Cochabamba, Bolivia.

## Estructura

```text
/
├── index.html
├── calefones/
│   └── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   ├── icons/
│   ├── images/
│   └── logos/
├── robots.txt
└── sitemap.xml
```

No requiere compilación ni un framework. Puede publicarse en Vercel, Netlify, Cloudflare Pages, cPanel, Hostinger o cualquier servidor de archivos estáticos.

## Desarrollo local

Sirve la carpeta raíz con cualquier servidor HTTP estático. No abras los archivos con `file://`, porque las rutas y algunas políticas del navegador se comportan de forma distinta.

Ejemplo con Python:

```bash
python -m http.server 4173
```

Luego abre `http://localhost:4173/`.

## Catálogo ASTOM B

El catálogo de Canva se carga solo después de pulsar **Ver catálogo interactivo** en `/calefones/`. El HTML inicial no incluye ningún `iframe` y no debe generar solicitudes a Canva antes de esa interacción.

La URL del visor está en el atributo `data-catalog-src` de `calefones/index.html`. La URL para pantalla completa aparece en el CTA de la misma sección.

## Contactos

- WhatsApp general: `+591 76697191`
- WhatsApp ASTOM B: `+591 69900093`
- Correo: `intraprod.bolivia@gmail.com`

El contacto ASTOM B es intencionalmente distinto. Revisa ambos números por separado antes de actualizar enlaces.

## Cambio futuro de dominio

Mientras no exista un dominio corporativo, los metadatos usan `https://intraprod-web.vercel.app`. Cuando se migre el dominio, reemplaza esa base en:

- canonical, Open Graph y datos estructurados de `index.html`;
- canonical, Open Graph y datos estructurados de `calefones/index.html`;
- `robots.txt`;
- `sitemap.xml`.

Las rutas internas y los recursos usan rutas relativas para mantener compatibilidad con hosting estático tradicional.

## Analítica futura

No se incluyen IDs ni scripts activos de Meta Pixel o Google Analytics. `js/app.js` publica el evento local `intraprod:conversion` con los tipos `whatsapp_click` y `catalog_open`. Una integración futura puede escuchar ese evento y enviarlo al proveedor configurado:

```js
document.addEventListener('intraprod:conversion', (event) => {
  // Integrar aquí GA4, Meta Pixel u otra herramienta con IDs reales.
  console.debug(event.detail.type);
});
```

Google Search Console se configura cuando el dominio definitivo esté disponible y verificado.

## Despliegue

Las ramas distintas de `main` pueden generar Preview Deployments mediante la integración de Git de Vercel. No se debe promover un Preview a producción hasta completar las comprobaciones responsive, de enlaces, consola y carga diferida del catálogo.
