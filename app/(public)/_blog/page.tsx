"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { en } from "@/dictionaries";

export default function BlogPage() {
  const t = useTranslations("blogPage");

  const featured = t.raw("featured");
  const topics = t.raw("topics");
  const posts: typeof en.blogPage.posts = t.raw("posts");
  const pagination = t.raw("pagination");

  return (
    <div className="bg-background">
      {/* Featured Post Section */}
      <section className="px-6 py-10 lg:py-16">
        <div className="container max-w-[1200px] mx-auto px-0 md:px-6">
          <Link href={`/blog/${featured.title.toLowerCase().replace(/ /g, "-")}`}>
            <article className="bg-card/30 relative overflow-hidden rounded-2xl group">
              <div className="absolute inset-0 rounded-2xl border border-border/60 pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.1),black_30%)] transition-colors group-hover:border-primary/30" />
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 relative">
                <div className="flex flex-col justify-between lg:p-6">
                  <div>
                    <span className="text-primary text-sm font-medium tracking-wide uppercase">
                      {featured.category}
                    </span>
                    <h1 className="text-foreground mt-3 text-[32px] font-bold leading-[1.2] tracking-tight lg:text-[42px]">
                      {featured.title}
                    </h1>
                    <p className="text-muted-foreground mt-4 max-w-[640px] text-lg leading-relaxed">
                      {featured.description}
                    </p>
                    <div className="text-muted-foreground mt-8 flex items-center gap-3">
                      <Image
                        alt={featured.author}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
                        src={featured.authorImage}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{featured.author}</span>
                        <span className="text-xs">{featured.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl lg:aspect-square lg:h-[450px] lg:w-[500px]">
                    <Image
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      src={featured.image}
                      priority
                    />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* Blog List with Sidebar */}
      <section className="px-6 py-10 lg:py-16">
        <div className="container max-w-[1200px] mx-auto grid gap-12 px-0 md:px-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-foreground text-sm font-bold uppercase tracking-wider">
                {topics.title}
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  type="search"
                  className="pl-10 h-11 rounded-xl border-border bg-card shadow-sm focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Mobile Topic Selector */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                className="w-full justify-between h-11 rounded-xl border-border bg-card px-4 text-sm font-medium shadow-sm transition-all"
              >
                <span>{topics.items[0]}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="space-y-1">
                {topics.items.map((topic: string, i: number) => (
                  <li key={i}>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-[8px] px-0 py-2 text-left text-sm transition-colors",
                        i === 0 ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className={cn(
                        "inline-flex items-center gap-3 pl-3 border-l-2",
                        i === 0 ? "border-primary" : "border-transparent"
                      )}>
                        {topic}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Posts Grid */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} className="group block">
                  <article className="overflow-hidden space-y-5">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50">
                      <Image
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        src={post.image}
                      />
                    </div>
                    <div>
                      <span className="text-primary text-xs font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                      <h4 className="text-foreground mt-2 text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-relaxed">
                        {post.description}
                      </p>
                      <div className="text-muted-foreground mt-5 flex items-center gap-3">
                        <Image
                          alt={post.author}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                          src={post.authorImage}
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground leading-none">{post.author}</span>
                          <span className="text-[10px] mt-0.5">{post.date}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border pt-8 mt-12">
              <p className="text-muted-foreground text-sm font-medium">
                {pagination.pageOf.replace("{current}", "1").replace("{total}", "2")}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  disabled
                  className="rounded-xl h-11 px-6 font-semibold shadow-sm disabled:opacity-50"
                >
                  {pagination.prev}
                </Button>
                <Button
                  className="rounded-xl h-11 px-6 font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {pagination.next}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
