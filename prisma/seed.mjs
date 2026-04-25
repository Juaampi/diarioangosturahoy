import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  const categories = [
    {
      name: "Locales",
      slug: "locales",
      description: "Noticias y actualidad de Villa La Angostura y la region.",
    },
    {
      name: "Nacionales",
      slug: "nacionales",
      description: "Cobertura de noticias nacionales relevantes para la audiencia local.",
    },
    {
      name: "Internacionales",
      slug: "internacionales",
      description: "Panorama internacional y hechos destacados del mundo.",
    },
    {
      name: "Deporte",
      slug: "deporte",
      description: "Cobertura deportiva local, nacional e internacional.",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Diario Angostura Hoy",
      tagline: "Diario Digital",
      location: "Villa La Angostura, Neuquen, Argentina",
      footerText:
        "Informacion local, regional y nacional con mirada patagonica.",
    },
  });

  const embeds = [
    { type: "RADIO", title: "Radio en vivo" },
    { type: "YOUTUBE", title: "YouTube en vivo" },
  ];

  for (const embed of embeds) {
    await prisma.liveEmbed.upsert({
      where: { type: embed.type },
      update: {},
      create: embed,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((category) => [category.slug, category.id]),
  );

  const samplePosts = [
    {
      title: "Villa La Angostura lanza un plan de invierno con actividades culturales y beneficios para residentes",
      excerpt:
        "El municipio presentó una agenda con propuestas para mayo y junio, descuentos en espacios culturales y una grilla especial para familias.",
      content:
        "La nueva agenda de invierno busca sostener el movimiento local durante la temporada baja con actividades culturales, ferias, talleres y propuestas al aire libre adaptadas al clima patagónico.\n\nDesde el Ejecutivo local señalaron que el programa fue diseñado junto a instituciones, comerciantes y referentes del turismo para fortalecer la economía regional y ampliar la oferta para residentes y visitantes.\n\nEl cronograma incluye funciones en el centro de convenciones, circuitos guiados por sectores históricos de la localidad, promociones gastronómicas y acciones de difusión con fuerte presencia digital.",
      categorySlug: "locales",
      author: "Redaccion",
      isMain: true,
      isFeatured: true,
      featuredImageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      tags: ["invierno", "agenda", "comunidad"],
      publishedAt: "2026-04-24T09:00:00.000Z",
    },
    {
      title: "Avanza la mejora del acceso al barrio Mallin con nuevas tareas de drenaje y bacheo",
      excerpt:
        "Los trabajos se concentran en los puntos mas comprometidos por las lluvias y buscan mejorar la transitabilidad antes del invierno.",
      content:
        "Operarios municipales iniciaron una nueva etapa de mejoramiento vial en el acceso al barrio Mallin, donde se realizan tareas de drenaje, relleno y bacheo sobre los sectores mas afectados.\n\nVecinos de la zona venian reclamando intervenciones preventivas antes de las heladas, especialmente en los tramos con mayor circulacion escolar y comercial.\n\nDesde Obras Publicas anticiparon que el plan seguira durante las proximas semanas con maquinaria pesada y evaluaciones periodicas tras cada frente de lluvia.",
      categorySlug: "locales",
      author: "Redaccion",
      isFeatured: true,
      featuredImageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      tags: ["obras", "barrios", "invierno"],
      publishedAt: "2026-04-24T10:30:00.000Z",
    },
    {
      title: "Productores regionales preparan una nueva feria de alimentos y diseno en el gimnasio municipal",
      excerpt:
        "Habra emprendedores locales, productos artesanales y propuestas familiares durante todo el fin de semana.",
      content:
        "La feria reunira a productores gastronómicos, emprendedores textiles y proyectos de diseño independiente con eje en la identidad local.\n\nLa organizacion espera una fuerte participacion de vecinos y turistas, con espacios para musica en vivo, degustaciones y actividades para infancias.\n\nEl evento tambien funcionara como vidriera para nuevos emprendimientos que buscan consolidarse en el circuito economico de Villa La Angostura.",
      categorySlug: "locales",
      author: "Redaccion",
      featuredImageUrl:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
      tags: ["feria", "emprendedores", "produccion-local"],
      publishedAt: "2026-04-24T11:15:00.000Z",
    },
    {
      title: "Neuquen anuncia una nueva linea de creditos para pymes turisticas y prestadores de servicios",
      excerpt:
        "La provincia presento financiamiento con tasa bonificada para equipamiento, refaccion y capital de trabajo.",
      content:
        "El gobierno provincial oficializo una nueva herramienta financiera orientada a pequenas y medianas empresas del sector turistico, con foco en destinos de montana y corredores regionales.\n\nLa linea contempla montos escalables, periodos de gracia y una tasa bonificada para inversiones en infraestructura, conectividad y sostenimiento de empleo.\n\nPrestadores de Villa La Angostura, San Martin de los Andes y Villa Traful aparecen entre los principales beneficiarios potenciales del programa.",
      categorySlug: "nacionales",
      author: "Redaccion",
      isFeatured: true,
      featuredImageUrl:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      tags: ["economia", "turismo", "pymes"],
      publishedAt: "2026-04-24T12:00:00.000Z",
    },
    {
      title: "Crece el debate por nuevas inversiones en conectividad aerea para fortalecer el turismo interno",
      excerpt:
        "Operadores y provincias reclaman una mejor coordinacion de rutas y frecuencias para destinos del interior.",
      content:
        "Funcionarios, cámaras empresariales y aeropuertos regionales coinciden en que mejorar la conectividad es una de las claves para sostener el turismo interno durante todo el año.\n\nEntre las prioridades aparecen nuevas frecuencias, articulacion entre destinos y campañas de promoción segmentadas por temporada.\n\nLa discusión también incluye la necesidad de integrar mejor los corredores patagónicos con escalas más eficientes.",
      categorySlug: "nacionales",
      author: "Redaccion",
      featuredImageUrl:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
      tags: ["turismo", "conectividad", "patagonia"],
      publishedAt: "2026-04-24T12:45:00.000Z",
    },
    {
      title: "Argentina refuerza programas de formacion digital para jovenes y trabajadores independientes",
      excerpt:
        "La iniciativa combina capacitacion virtual, acompanamiento tecnico y becas para trayectos breves.",
      content:
        "El nuevo esquema de formacion busca ampliar oportunidades laborales en sectores vinculados a tecnologia, marketing, servicios remotos y oficios digitales.\n\nLas inscripciones se abriran por etapas y contaran con instancias de tutorias, prácticas y certificaciones para mejorar la empleabilidad.\n\nReferentes educativos destacaron que el programa puede tener impacto positivo en ciudades intermedias y localidades con fuerte crecimiento emprendedor.",
      categorySlug: "nacionales",
      author: "Redaccion",
      featuredImageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      tags: ["educacion", "empleo", "tecnologia"],
      publishedAt: "2026-04-24T13:15:00.000Z",
    },
    {
      title: "Chile y Argentina aceleran una agenda binacional para fortalecer pasos fronterizos y turismo",
      excerpt:
        "Autoridades y camaras empresarias avanzan en acuerdos operativos para agilizar transitos y potenciar la temporada.",
      content:
        "La agenda binacional pone el foco en la facilitacion del cruce, la coordinacion aduanera y la promocion conjunta de circuitos turísticos de montaña.\n\nPara Villa La Angostura, la dinamica del paso Samoré es considerada estratégica por su impacto en el comercio, la conectividad y el flujo de visitantes.\n\nLos equipos técnicos volverán a reunirse en las próximas semanas para definir protocolos y acciones de difusión compartidas.",
      categorySlug: "internacionales",
      author: "Redaccion",
      isFeatured: true,
      featuredImageUrl:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      tags: ["chile", "frontera", "samore"],
      publishedAt: "2026-04-24T14:00:00.000Z",
    },
    {
      title: "Europa consolida nuevas estrategias para desestacionalizar destinos de naturaleza y montaña",
      excerpt:
        "El enfoque combina movilidad sostenible, experiencias locales y politicas de menor impacto ambiental.",
      content:
        "Varios destinos europeos especializados en turismo de naturaleza comenzaron a presentar indicadores positivos en sus planes para distribuir mejor la demanda durante el año.\n\nLas estrategias incluyen movilidad integrada, incentivos para temporadas medias, producción cultural local y promoción de escapadas de corta duración.\n\nEspecialistas del sector observan que parte de esas medidas podrían adaptarse a regiones patagónicas con identidad de montaña.",
      categorySlug: "internacionales",
      author: "Redaccion",
      featuredImageUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      tags: ["turismo", "naturaleza", "sustentabilidad"],
      publishedAt: "2026-04-24T14:30:00.000Z",
    },
    {
      title: "Organismos climáticos reportan nuevas alertas por cambios en patrones de nieve en regiones andinas",
      excerpt:
        "Los informes advierten sobre variaciones de precipitacion y la necesidad de adaptar planificaciones estacionales.",
      content:
        "Nuevos reportes internacionales recomiendan reforzar sistemas de monitoreo y planificacion flexible para destinos de nieve, ante escenarios con mayor variabilidad interanual.\n\nLa lectura tecnica incluye efectos sobre reservas, mantenimiento de centros de montaña y manejo del agua en cuencas cordilleranas.\n\nEn la Patagonia, especialistas siguen con atención estos indicadores por su impacto en turismo, ambiente y economías regionales.",
      categorySlug: "internacionales",
      author: "Redaccion",
      featuredImageUrl:
        "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1200&q=80",
      tags: ["clima", "nieve", "andes"],
      publishedAt: "2026-04-24T15:00:00.000Z",
    },
    {
      title: "Deportivo Angostura abre la pretemporada con foco en juveniles y preparacion fisica",
      excerpt:
        "El club presento su cronograma de entrenamientos y un plan de seguimiento para futbol formativo.",
      content:
        "El cuerpo técnico comenzó una nueva etapa de trabajo con planteles mayores y juveniles, priorizando la base física, la coordinación y la integración de nuevos talentos.\n\nAdemás del calendario competitivo, la institución confirmó acciones para fortalecer la formación deportiva y el acompañamiento de divisiones inferiores.\n\nDesde el club remarcaron que el objetivo es consolidar una identidad de juego y potenciar el semillero local.",
      categorySlug: "deporte",
      author: "Redaccion",
      isFeatured: true,
      featuredImageUrl:
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
      tags: ["futbol", "juveniles", "clubes"],
      publishedAt: "2026-04-24T15:30:00.000Z",
    },
    {
      title: "Se viene una nueva fecha del circuito regional de trail con participacion angosturense",
      excerpt:
        "Corredores locales ajustan detalles para una competencia que reunira atletas de toda la cordillera.",
      content:
        "La próxima fecha del circuito regional de trail running espera una convocatoria amplia, con representantes de Villa La Angostura, Bariloche, San Martín y localidades chilenas.\n\nEntrenadores y atletas destacaron el valor de estas pruebas para consolidar el calendario de montaña y visibilizar el crecimiento del running en la región.\n\nEl recorrido combinará desniveles exigentes, bosque nativo y tramos panorámicos sobre lagos y valles.",
      categorySlug: "deporte",
      author: "Redaccion",
      featuredImageUrl:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
      tags: ["trail", "montana", "running"],
      publishedAt: "2026-04-24T16:00:00.000Z",
    },
    {
      title: "Escuelas deportivas municipales amplian cupos para hockey, atletismo y basquet",
      excerpt:
        "La inscripcion sigue abierta y el objetivo es sumar mas chicos y chicas a la actividad regular.",
      content:
        "La subsecretaría de Deportes confirmó una ampliación de cupos en varias disciplinas con fuerte demanda entre niñas, niños y adolescentes.\n\nLas nuevas vacantes se habilitaron tras una reorganización de horarios, disponibilidad de entrenadores y uso de espacios comunitarios.\n\nLa propuesta apunta a fortalecer la práctica sostenida, mejorar hábitos saludables y ampliar la base deportiva local.",
      categorySlug: "deporte",
      author: "Redaccion",
      featuredImageUrl:
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
      tags: ["hockey", "atletismo", "basquet"],
      publishedAt: "2026-04-24T16:30:00.000Z",
    },
  ];

  for (const samplePost of samplePosts) {
    const slug = slugify(samplePost.title);

    const post = await prisma.post.upsert({
      where: { slug },
      update: {
        title: samplePost.title,
        excerpt: samplePost.excerpt,
        content: samplePost.content,
        featuredImageUrl: samplePost.featuredImageUrl,
        categoryId: categoryMap[samplePost.categorySlug],
        status: "PUBLISHED",
        isMain: samplePost.isMain || false,
        isFeatured: samplePost.isFeatured || false,
        sourceType: "MANUAL",
        author: samplePost.author,
        publishedAt: new Date(samplePost.publishedAt),
        deletedAt: null,
      },
      create: {
        title: samplePost.title,
        slug,
        excerpt: samplePost.excerpt,
        content: samplePost.content,
        featuredImageUrl: samplePost.featuredImageUrl,
        categoryId: categoryMap[samplePost.categorySlug],
        status: "PUBLISHED",
        isMain: samplePost.isMain || false,
        isFeatured: samplePost.isFeatured || false,
        sourceType: "MANUAL",
        author: samplePost.author,
        publishedAt: new Date(samplePost.publishedAt),
      },
    });

    await prisma.postTag.deleteMany({ where: { postId: post.id } });

    for (const tagName of samplePost.tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: slugify(tagName) },
        update: { name: tagName },
        create: { name: tagName, slug: slugify(tagName) },
      });

      await prisma.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id,
        },
      });
    }
  }

  const sampleBanners = [
    {
      title: "Turismo y experiencias de montana",
      imageUrl:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      position: "HOME_TOP",
      isActive: true,
    },
    {
      title: "Sabores patagonicos y gastronomia local",
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
      position: "HOME_MIDDLE",
      isActive: true,
    },
    {
      title: "Escapadas y hospedajes de montana",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      position: "HOME_MIDDLE",
      isActive: true,
    },
    {
      title: "Agenda cultural de la semana",
      imageUrl:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      position: "SIDEBAR",
      isActive: true,
    },
    {
      title: "Comercios y servicios recomendados",
      imageUrl:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      position: "SIDEBAR",
      isActive: true,
    },
    {
      title: "Moda outdoor y equipamiento",
      imageUrl:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
      position: "SIDEBAR",
      isActive: true,
    },
    {
      title: "Cabanas y refugios de montana",
      imageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      position: "SIDEBAR",
      isActive: true,
    },
  ];

  for (const banner of sampleBanners) {
    await prisma.banner.upsert({
      where: { id: slugify(`${banner.position}-${banner.title}`) },
      update: banner,
      create: {
        id: slugify(`${banner.position}-${banner.title}`),
        ...banner,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
