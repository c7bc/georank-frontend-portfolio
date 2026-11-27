"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { use } from "react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const t = useTranslations("blogPage");
  const post = t.raw("postDetail");

  return (
    <article className="w-full bg-background">
      {/* Back to Blog */}
      <div className="container max-w-6xl mx-auto px-4 md:px-6 pt-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to list
        </Link>
      </div>

      <section className="px-6 pb-12 lg:pb-16">
        <div className="bg-card/30 relative overflow-hidden rounded-[32px] container max-w-6xl mx-auto px-0 border-none">
          <div className="absolute inset-0 rounded-[32px] border border-border/60 pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.1),black_30%)]" />
          <div className="mx-auto max-w-[992px] px-4 py-8 md:py-16 relative">
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] md:text-xs">
              {post.category}
            </span>
            <h1 className="text-foreground mt-4 text-[32px] leading-[1.1] font-bold tracking-tight lg:text-[52px]">
              {post.title}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-[760px] text-lg lg:text-xl leading-relaxed">
              {post.description}
            </p>
            
            <div className="mt-10">
              <div className="relative mx-auto aspect-[16/9] w-full max-w-[980px] overflow-hidden rounded-2xl border border-border/20">
                <Image 
                  alt={post.title}
                  fill
                  className="object-cover"
                  src={post.image}
                  priority
                />
              </div>
            </div>

            <div className="text-muted-foreground mt-8 flex items-center gap-4">
              <div className="relative size-10 overflow-hidden rounded-full border border-border/10">
                <Image 
                  alt={post.author}
                  fill
                  className="object-cover"
                  src={post.authorImage}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-none">{post.author}</span>
                <span className="text-[12px] mt-1 font-medium opacity-60">
                  {post.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 lg:py-16">
        <div className="container max-w-6xl mx-auto px-0">
          <div className="mx-auto max-w-[760px] px-4">
            <div className="flex items-center gap-2 mb-8">
               <div className="h-px flex-1 bg-border/50" />
               <small className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
                {post.readingTime}
               </small>
               <div className="h-px flex-1 bg-border/50" />
            </div>

            <div 
              className="mt-6 text-muted-foreground text-lg leading-relaxed 
                         [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-6
                         [&_h3]:text-foreground [&_h3]:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:mt-10 [&_h3]:mb-4
                         [&_p]:mb-6
                         [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:space-y-4
                         [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol]:space-y-4
                         [&_li]:marker:text-primary [&_li]:marker:font-bold
                         [&_hr]:border-border [&_hr]:my-12
                         [&_strong]:text-foreground [&_strong]:font-bold
                         [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-10 [&_blockquote]:text-foreground/80
                         [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-opacity hover:[&_a]:opacity-80"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </div>
        </div>
      </section>
    </article>
  );
}
