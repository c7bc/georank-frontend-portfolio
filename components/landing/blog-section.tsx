"use client";

import { useTranslations } from "next-intl";

const posts = [
  {
    key: "0",
    image: "https://picsum.photos/seed/georank-blog-1/500/375",
    avatar: "https://i.pravatar.cc/48?img=15",
  },
  {
    key: "1",
    image: "https://picsum.photos/seed/georank-blog-2/500/375",
    avatar: "https://i.pravatar.cc/48?img=25",
  },
  {
    key: "2",
    image: "https://picsum.photos/seed/georank-blog-3/500/375",
    avatar: "https://i.pravatar.cc/48?img=33",
  },
  {
    key: "3",
    image: "https://picsum.photos/seed/georank-blog-4/500/375",
    avatar: "https://i.pravatar.cc/48?img=41",
  },
];

function BlogCard({ post, t }: { post: (typeof posts)[number]; t: ReturnType<typeof useTranslations> }) {
  return (
    <article className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[250px_minmax(0,1fr)] sm:gap-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:w-[250px]">
        <img
          alt={t(`items.${post.key}.title`)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          src={post.image}
        />
      </div>
      <div>
        <div className="text-primary text-sm font-medium">
          {t(`items.${post.key}.category`)}
        </div>
        <h3 className="text-foreground mt-1 text-[22px] leading-[1.25] font-medium tracking-tight">
          {t(`items.${post.key}.title`)}
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
          {t(`items.${post.key}.description`)}
        </p>
        <div className="text-muted-foreground mt-4 flex items-center gap-3">
          <img
            alt={t(`items.${post.key}.author`)}
            loading="lazy"
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
            src={post.avatar}
          />
          <span className="text-xs">{t(`items.${post.key}.author`)}</span>
          <span className="text-xs">&bull;</span>
          <span className="text-xs">{t(`items.${post.key}.date`)}</span>
        </div>
      </div>
    </article>
  );
}

export function BlogSection() {
  const t = useTranslations("blogSection");

  return (
    <section className="px-6 py-16 lg:py-24">
      <div className="container max-w-[1200px] mx-auto px-0 md:px-6">
        <div className="text-center">
          <div className="text-primary text-sm font-medium">{t("tagline")}</div>
          <h2 className="text-foreground mt-2 text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-[720px]">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-2">
          <div className="space-y-10">
            {posts.slice(0, 2).map((post) => (
              <BlogCard key={post.key} post={post} t={t} />
            ))}
          </div>
          <div className="space-y-10">
            {posts.slice(2, 4).map((post) => (
              <BlogCard key={post.key} post={post} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
