import ZoozImage from "@/components/shared/zooz-image";
import { Link } from "@/lib/i18n/navigation";
import { TBlogPost } from "@/lib/types";
import { estimateReadingTime, minutesToDateTime } from "@/lib/utils";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  post: TBlogPost;
}

export default function Card({ post }: Props) {
  const t = useTranslations("customer.blog");
  const readingTime = estimateReadingTime(post.content ?? "");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex aspect-[3/3.1] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border drop-shadow-sm dark:drop-shadow-none"
    >
      <div className="p-s-m">
        {post.title && <h2 className="text-[2.4rem] font-medium">{post.title}</h2>}

        {post.description && (
          <p className="line-clamp-3 min-h-[6.4rem] max-w-[38ch] text-[1.45rem] leading-[2rem] text-gray-500 dark:text-gray-400">
            {post.description}
          </p>
        )}

        <div className="mt-s-m flex items-center justify-between">
          {post.tag && (
            <div className="max-w-fit cursor-pointer rounded-full bg-gray-100 px-2xs-xs py-3xs-2xs text-[1.18rem] font-medium uppercase text-on-primary-1/80 transition-all hover:bg-gray-200">
              {post.tag}
            </div>
          )}

          {readingTime && (
            <time
              dateTime={minutesToDateTime(readingTime)}
              className="text-lg font-extralight opacity-0 transition-all group-hover:opacity-100"
            >
              <span className="font-medium">{readingTime}</span> {t("min")}
            </time>
          )}
        </div>
      </div>

      <div className="relative w-full flex-grow overflow-hidden bg-gray-300">
        <ZoozImage
          src={post.cover_image ?? ""}
          alt={post.title ?? t("blog-post-cover")}
          sizes="100vw"
          fill
          className="object-cover transition-all duration-[750ms] ease-out group-hover:scale-105"
        />
      </div>

      <FontAwesomeIcon
        icon={faAngleRight}
        className="absolute right-xs-s top-xs-s -rotate-45 opacity-0 transition-all duration-[380ms] ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100 rtl:-translate-x-1 rtl:rotate-45 rtl:scale-x-[-1]"
        size="xl"
      />
    </Link>
  );
}
