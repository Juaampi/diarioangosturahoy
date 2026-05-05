import Image from "next/image";
import Link from "next/link";

import { BannerSlot } from "@/components/site/banner-slot";
import { LiveEmbeds } from "@/components/site/live-embeds";
import { PostCard } from "@/components/site/post-card";
import { getHomeData, getLayoutData } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function Home() {
  const [{ embeds, settings }, homeData] = await Promise.all([getLayoutData(), getHomeData()]);
  const { mainPost, featuredPosts, latestPosts, categories, topBanners, middleBanners, sidebarBanners } =
    homeData;
  const orderedSectionSlugs = ["locales", "regionales", "nacionales", "internacionales", "deporte"];
  const orderedCategories = [...categories].sort((left, right) => {
    const leftIndex = orderedSectionSlugs.indexOf(left.slug);
    const rightIndex = orderedSectionSlugs.indexOf(right.slug);

    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });

  return (
    <div className="editorial-shell">
      <div className="mx-auto max-w-[1600px] space-y-10 px-4 py-8 lg:px-6 2xl:px-10">
        <section className="grid gap-6 lg:grid-cols-[2.1fr_1fr]">
          <div className="overflow-hidden rounded-[36px] border border-[color:var(--line)] bg-white shadow-[0_24px_80px_rgba(18,59,103,0.1)]">
            {mainPost ? (
              <Link href={`/noticia/${mainPost.slug}`} className="grid h-full lg:grid-cols-[1.3fr_1fr]">
                <div className="relative min-h-[320px]">
                  {mainPost.featuredImageUrl ? (
                    <Image src={mainPost.featuredImageUrl} alt={mainPost.title} fill className="object-cover" priority />
                  ) : (
                    <div className="h-full bg-[image:linear-gradient(140deg,var(--deep-lake),var(--cold-sky))]" />
                  )}
                </div>
                <div className="flex flex-col justify-between p-8">
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--lake-blue)]">
                      Noticia principal
                    </p>
                    <h1 className="font-serif text-4xl leading-tight text-balance text-[color:var(--ink)]">
                      {mainPost.title}
                    </h1>
                    <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
                      {mainPost.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted-foreground)]">
                    <span>{mainPost.category?.name}</span>
                    <span>{formatDate(mainPost.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-10">
                <h1 className="font-serif text-4xl text-[color:var(--ink)]">Diario Angostura Hoy</h1>
                <p className="mt-4 max-w-2xl text-lg text-[color:var(--muted-foreground)]">
                  El sitio ya esta listo para empezar a cargar noticias locales, banners, transmisiones en vivo y contenido externo en revision.
                </p>
              </div>
            )}
          </div>
          <div className="grid gap-6">
            {featuredPosts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <BannerSlot banners={topBanners.slice(0, 2)} className="grid gap-4 md:grid-cols-2" />

            <div className="space-y-8">
              {orderedCategories.map((category) => {
                if (!category.posts.length) return null;
                const postsToRender = category.slug === "locales" ? category.posts.slice(0, 6) : category.posts.slice(0, 3);

                return (
                  <section key={category.id} className="space-y-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--forest-green)]">
                          Seccion
                        </p>
                        <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">{category.name}</h3>
                      </div>
                      <Link
                        href={`/categoria/${category.slug}`}
                        className="text-sm font-semibold text-[color:var(--lake-blue)]"
                      >
                        Ver mas
                      </Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {postsToRender.map((post) => (
                        <PostCard key={post.id} post={post} compact />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--forest-green)]">
                    Ultimas noticias
                  </p>
                  <h2 className="mt-2 font-serif text-4xl text-[color:var(--ink)]">Panorama informativo general</h2>
                </div>
                <Link href="/categoria/locales" className="text-sm font-semibold text-[color:var(--lake-blue)]">
                  Ver Locales
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {latestPosts.slice(0, 6).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(15,77,134,0.92),rgba(43,107,71,0.85))] p-8 text-white shadow-[0_20px_60px_rgba(15,77,134,0.2)]">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">Comunidad en vivo</p>
                  <h3 className="mt-3 font-serif text-4xl">{settings.siteName}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                    Un diario local con enfoque moderno, agenda de comunidad, cobertura regional y espacios para radio, streaming y participacion de la audiencia.
                  </p>
                </div>
                <LiveEmbeds embeds={embeds as never} facebookUrl={settings.facebookUrl} />
              </div>
            </div>

            {featuredPosts.slice(2, 6).length ? (
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featuredPosts.slice(2, 6).map((post) => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </section>
            ) : null}

            <BannerSlot banners={middleBanners.slice(0, 2)} className="grid gap-4 md:grid-cols-2" />
          </div>

          <aside className="space-y-5">
            <div className="xl:sticky xl:top-[220px] xl:space-y-5">
              <BannerSlot banners={sidebarBanners} className="space-y-4" />
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
