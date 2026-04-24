# Diario Angostura Hoy

Portal periodistico MVP para Villa La Angostura, Neuquen, Argentina.

Stack principal:

- Next.js 16 con App Router
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- Neon PostgreSQL
- Netlify compatible
- NewsAPI para revision de noticias externas
- Cloudinary opcional para subida de imagenes

## Lo que incluye

- Home editorial con noticia principal, destacadas, ultimas, categorias y banners
- Secciones publicas: `Locales`, `Nacionales`, `Internacionales`, `Deporte`
- Pagina de noticia con relacionadas, share y WhatsApp
- Buscador por titulo, contenido, categoria y etiquetas
- Seccion publica `Noticias externas`
- Panel admin protegido por `ADMIN_EMAIL` y `ADMIN_PASSWORD`
- CRUD de noticias manuales
- Importador de NewsAPI con prevencion de duplicados por `external_url`
- CRUD de banners
- Configuracion de radio, YouTube en vivo, contacto y redes
- SEO base: metadata dinamica, Open Graph, `sitemap.xml`, `robots.txt`

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example`:

```env
DATABASE_URL=
NEWSAPI_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SESSION_SECRET=
```

Notas:

- `DATABASE_URL`: cadena de conexion de Neon PostgreSQL.
- `SESSION_SECRET`: recomendable en produccion para firmar la cookie del admin.
- Cloudinary es opcional. Si no se configura, puedes trabajar con URLs externas de imagen.

## Instalacion local

```bash
npm install
npx prisma generate
npx prisma db push
node prisma/seed.mjs
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Configuracion de Neon

1. Crea un proyecto en Neon.
2. Copia la cadena de conexion PostgreSQL en `DATABASE_URL`.
3. Ejecuta:

```bash
npx prisma db push
node prisma/seed.mjs
```

Esto crea las tablas base y precarga:

- categorias iniciales
- configuracion inicial del sitio
- placeholders de embeds en vivo

## NewsAPI

Variables requeridas:

- `NEWSAPI_KEY`

Uso en el proyecto:

- Seccion publica `/noticias-externas`
- Panel admin `/admin/import`

Comportamiento:

- consulta hasta 100 resultados por ingreso
- nacionales con `top-headlines` para `country=ar`
- internacionales con `everything`
- no publica automaticamente
- evita duplicados por `external_url`

Importante al 24 de abril de 2026:

- NewsAPI permite `pageSize` maximo 100 en `everything` y `top-headlines`
- el plan Developer tiene demora de 24 horas
- el plan Developer sigue siendo solo para desarrollo/testing, no para produccion comercial

Si vas a publicar el sitio en produccion con este flujo, conviene subir de plan o cambiar de proveedor de noticias.

## Cloudinary

La subida de imagenes desde el panel usa Cloudinary si completas:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Si no completas esas variables:

- el sitio sigue funcionando
- puedes pegar URLs externas manualmente en noticias y banners

## Credenciales de admin

El panel usa login basico por variables de entorno:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Ruta:

- `/admin/login`

## Scripts utiles

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:push
npm run db:seed
```

## Estructura principal

```text
prisma/
  schema.prisma
  seed.mjs
public/
  logo-angostura-hoy.svg
src/
  app/
    admin/
    api/
    buscar/
    categoria/[slug]/
    noticia/[slug]/
    noticias-externas/
    robots.ts
    sitemap.ts
  components/
    admin/
    site/
  lib/
    actions.ts
    auth.ts
    newsapi.ts
    prisma.ts
    queries.ts
```

## Deploy en Netlify

Netlify soporta App Router, SSR, Route Handlers y Server Actions de Next.js con soporte moderno via OpenNext y zero configuration.

Pasos:

1. Sube este proyecto a GitHub, GitLab o Bitbucket.
2. Crea un nuevo sitio en Netlify conectado al repo.
3. Configura las variables de entorno del `.env.example`.
4. Usa:

```text
Build command: npm run build
```

Normalmente Netlify detecta Next.js automaticamente. No hace falta fijar manualmente un publish directory ni pinnear `@netlify/plugin-nextjs`, salvo que quieras volver a una version vieja del adapter.

5. Asegurate de que el sitio tenga acceso a `DATABASE_URL`.
6. Despliega.

Archivo incluido:

- `netlify.toml`

## Observaciones de produccion

- para contenido externo en produccion, valida condiciones del plan de NewsAPI
- para seguridad real conviene agregar tabla `users` con hashing y roles
- para mayor trazabilidad futura puedes sumar editor enriquecido, auditoria y drafts programados
- para contenido full-text avanzado puedes migrar luego a busqueda PostgreSQL nativa o Meilisearch

## Checklist rapido

- completar `.env`
- correr `npx prisma db push`
- correr `node prisma/seed.mjs`
- entrar a `/admin/login`
- cargar settings, radio, YouTube, banners y primeras noticias
