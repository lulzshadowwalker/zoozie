import { fetchApi } from "@/lib/api";
import { IBasePageParams, TBlogPost } from "@/lib/types";
import {
  estimateReadingTime,
  formatDateTime,
  minutesToDateTime,
} from "@/lib/utils";
import { notFound } from "next/navigation";

import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ZoozImage from "@/components/shared/zooz-image";
import Card from "@/components/customer/blog/card";
import SocialLinks from "@/components/customer/blog/social-links";
import Config from "@/lib/config";

interface Props extends Omit<IBasePageParams, "params"> {
  params: IBasePageParams["params"] & { slug: string };
}

async function getPosts(locale: string): Promise<TBlogPost[]> {
  const res = await fetch(Config.flaskCmsBaseUrl + "/posts", {
    headers: { 'Accept-Language': locale }
  });
  if (!res.ok) {
    console.error("failed to fetch blog posts because " + res.statusText);
    return [];
  }

  return (await res.json()) as TBlogPost[] ?? [];
}

export async function generateStaticParams({
  params: { locale },
}: {
  params: IBasePageParams["params"];
}) {
  const posts = await getPosts(locale);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params: { locale, slug } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const posts = await getPosts(locale);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  const ogImages: string[] = [];
  if (post.cover_image) {
    ogImages.push(post.cover_image);
  }

  return {
    title: post.meta_title,
    description: post.meta_description,
    keywords: post.keywords,
    robots: {
      follow: post.prevent_indexing === 0,
      index: post.prevent_indexing === 0,
    },
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      images: ogImages,
    },
  };
}

export default async function BlogPost({ params: { locale, slug } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("customer.blog");

  const posts = await getPosts(locale);
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const estimatedTime = estimateReadingTime(post.content);

  // Randomly select 3 recommended posts
  const otherPosts = posts.filter((p) => p.id !== post.id);
  const recommendedPosts = otherPosts.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <main className="mx-auto my-2xl-3xl">
      <section className="px-page">
        {post.tag && (
          <div className="mx-auto mb-s-m max-w-fit cursor-pointer rounded-full bg-gray-100 px-xs-s py-2xs-xs text-base font-medium uppercase text-on-primary-1/80 transition-all hover:bg-gray-200">
            {post.tag}
          </div>
        )}

        {post.title && (
          <h1 className="max-w-[55ch] text-balance text-center text-4xl">
            {post.title}
          </h1>
        )}

        {post.description && (
          <p className="mx-auto max-w-[62ch] text-center text-lg font-light">
            {post.description}
          </p>
        )}

        <div className="mx-auto mt-s-m flex max-w-[40rem] flex-wrap items-center justify-center gap-l-xl">
          {post.created_at && (
            <div>
              <p className="text-center text-lg font-medium uppercase">
                {t("date")}
              </p>
              <time
                dateTime={post.created_at}
                className="text-center text-lg font-light"
              >
                {await formatDateTime(post.created_at)}
              </time>
            </div>
          )}

          {estimatedTime && (
            <div>
              <p className="text-center text-lg font-medium uppercase">
                {t("read")}
              </p>
              <time
                dateTime={minutesToDateTime(estimatedTime)}
                className="text-center text-lg font-light"
              >
                {estimatedTime} {t("min")}
              </time>
            </div>
          )}
        </div>
      </section>

      {post.cover_image && (
        <div className="relative my-xl-2xl aspect-video overflow-hidden rounded-[5rem] bg-gray-300 md:mx-page">
          <ZoozImage
            src={post.cover_image}
            alt={post.title ?? t("cover")}
            title={post.title ?? t("cover")}
            fill
            sizes="(min-width: 2020px) 1770px, (min-width: 780px) calc(90.98vw - 50px), 100vw"
            quality={90}
            priority
            className="object-cover transition-all duration-[900ms] ease-out hover:scale-105"
          />
        </div>
      )}

      <div className="mx-auto flex max-w-[90ch] max-md:flex-col-reverse">
        <div className="relative">
          <SocialLinks className="sticky top-[8rem] flex-col justify-center max-md:my-l-xl max-md:flex-row max-md:gap-m-l" />
        </div>

        {post.content && (
          <article
            className="w-full max-w-[85ch] px-page prose prose-2xl dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        )}
      </div>

      {recommendedPosts.length > 0 && (
        <section className="my-2xl-3xl px-page">
          <h2 className="text-balance text-center text-3xl font-medium">
            {t("related-posts-title")}
          </h2>
          <hr className="my-l-xl h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(35rem,1fr))] justify-items-center gap-s-m">
            {recommendedPosts.map((post, index) => (
              <Card key={index} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
