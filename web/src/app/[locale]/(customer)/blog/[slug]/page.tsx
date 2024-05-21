import { fetchApi, getStrapiFileUrl } from "@/lib/api";
import { IBasePageParams, TBlogPost, TCmsPicture } from "@/lib/types";
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

interface Props extends Omit<IBasePageParams, "params"> {
  params: IBasePageParams["params"] & { slug: string };
}

export async function generateStaticParams({
  params: { locale },
}: {
  params: IBasePageParams["params"];
}) {
  const res = await fetchApi("/posts", {
    source: "strapi",
    queryParams: {
      locale,
      populate: "deep",
    },
  });
  if (!res.ok) {
    if (res.status === 404) {
      console.error("failed to fetch blog posts because " + res.statusText);
    }

    return [];
  }

  const posts = (await res.json())?.data as TBlogPost[] | undefined;
  if (!posts) {
    console.error("posts are not in the expected format or are empty");
    return [];
  }

  return posts.map((post) => ({
    slug: post?.attributes?.slug,
  }));
}

export async function generateMetadata(
  { params: { locale, slug } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const res = await fetchApi("/posts", {
    source: "strapi",
    queryParams: {
      locale,
      "filters[slug][$eq]": slug,
      populate: "deep",
    },
  });
  if (!res.ok) {
    if (res.status === 404) {
      console.error("failed to fetch blog post because " + res.statusText);
    }

    return {};
  }

  const post = (await res.json())?.data?.[0]?.attributes as
    | TBlogPost["attributes"]
    | undefined;
  if (!post) {
    console.error(
      `post with slug ${slug} is not in the expected format or not found`,
    );
    return {};
  }

  const seo = post.SEO;

  const ogImages: string[] = [];
  const sharedImage = seo?.sharedImage?.media?.attributes?.url;
  sharedImage && ogImages.push(getStrapiFileUrl(sharedImage)!.href);
  const pictures = post?.pictures?.data
    ?.flatMap((picture) => picture?.attributes?.url)
    .filter(Boolean);
  pictures?.length && ogImages.push(getStrapiFileUrl(pictures[0])!.href);

  return {
    title: seo?.metaTitle,
    description: seo?.metaDescription,
    keywords: seo?.keywords,
    robots: {
      follow: seo?.preventIndexing,
      index: seo?.preventIndexing,
    },
    openGraph: {
      title: seo?.metaTitle, // NOTE: It seems that the default metaTitle is used as fallback even if it was not explicitly set
      description: seo?.metaDescription,
      images: ogImages, // NOTE: it simply ignores an empty array, or an array with empty strings
    },
  };
}

export default async function BlogPost({ params: { locale, slug } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("customer.blog");

  const res = await fetchApi("/posts", {
    source: "strapi",
    queryParams: {
      "filters[slug][$eq]": slug,
      populate: ["deep", "10"],
    },
  });
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("failed to fetch blog post because " + res.statusText);
  }

  const post = (await res.json())?.data?.[0]?.attributes as
    | TBlogPost["attributes"]
    | undefined;
  if (!post) notFound();

  const coverPicture = post?.pictures?.data?.[0]?.attributes as
    | TCmsPicture["attributes"]
    | undefined;

  if (!post?.content) {
    throw new Error("post content is not in the expected format");
  }

  const estimatedTime = estimateReadingTime(post?.content);

  return (
    <main className="mx-auto my-2xl-3xl">
      <section className="px-page">
        {post?.tag && (
          <div className="mx-auto mb-s-m max-w-fit cursor-pointer rounded-full bg-gray-100 px-xs-s py-2xs-xs text-base font-medium uppercase text-on-primary-1/80 transition-all hover:bg-gray-200">
            {post?.tag}
          </div>
        )}

        {post?.title && (
          <h1 className="max-w-[55ch] text-balance text-center text-4xl">
            {post?.title}
          </h1>
        )}

        {post.description && (
          <p className="mx-auto max-w-[62ch] text-center text-lg font-light">
            {post.description}
          </p>
        )}

        <div className="mx-auto mt-s-m flex max-w-[40rem] flex-wrap items-center justify-center gap-l-xl">
          {post.createdAt && (
            <div>
              <p className="text-center text-lg font-medium uppercase">
                {t("date")}
              </p>
              <time
                dateTime={post.createdAt}
                className="text-center text-lg font-light"
              >
                {await formatDateTime(post.createdAt)}
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

      {coverPicture && (
        <div className="relative my-xl-2xl aspect-video overflow-hidden rounded-[5rem] bg-gray-300 md:mx-page">
          <ZoozImage
            src={getStrapiFileUrl(coverPicture?.url)?.href ?? ""}
            alt={coverPicture?.alternativeText ?? t("cover")}
            title={coverPicture?.alternativeText ?? t("cover")}
            fill
            sizes="(min-width: 2020px) 1770px, (min-width: 780px) calc(90.98vw - 50px), 100vw"
            quality={90}
            priority
            className="transition-all duration-[900ms] ease-out hover:scale-105"
          />
        </div>
      )}

      <div className="mx-auto flex max-w-[90ch] max-md:flex-col">
        <div className="relative">
          <SocialLinks className="sticky top-[8rem] flex-col justify-center max-md:my-l-xl max-md:flex-row max-md:gap-m-l" />
        </div>

        {post?.content && (
          <article
            className="w-full max-w-[85ch] px-page"
            dangerouslySetInnerHTML={{
              __html: post?.content,
            }}
          />
        )}
      </div>

      {post?.relatedPosts?.posts?.data?.length && (
        <section className="my-2xl-3xl px-page">
          <h2 className="text-balance text-center text-3xl font-medium">
            {post?.relatedPosts?.title ?? t("related-posts-title")}
          </h2>
          <hr className="my-l-xl h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(35rem,1fr))] justify-items-center gap-s-m">
            {post?.relatedPosts?.posts?.data?.map((post, index) => (
              <Card key={index} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
