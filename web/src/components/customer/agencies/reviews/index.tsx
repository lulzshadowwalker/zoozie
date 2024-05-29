import ZoozImage from "@/components/shared/zooz-image";
import { getTranslations } from "next-intl/server";
import Section from "../section";
import { TAgency, TAgencyReview } from "@/lib/types";
import { fetchApi } from "@/lib/api";
import { getCustomerImage } from "@/lib/utils";
import { Fragment } from "react";
import WriteReviewButton from "./write-review-button";
import Time from "@/components/shared/time";

type Props = {
  agency: TAgency;
};

export default async function Reviews({ agency }: Props) {
  const t = await getTranslations("customer.agency");

  const res = await fetchApi(`/agencies/${agency.id}/reviews`, {
    init: { cache: "no-store" },
  });

  if (!res.ok) {
    console.error(
      "failed to fetch reviews for agency %f because %s",
      agency.id,
      res.statusText,
    );
    return <></>;
  }

  const reviews = (await res.json())?.data?.reviews as
    | TAgencyReview[]
    | undefined;

  if (!reviews) {
    console.error("agency reviews response is not in the expected format");
    return <></>;
  }
  return (
    <Section id="reviews">
      <article className="mt-l-xl flex flex-col border-t pt-l-xl">
        <h2 className="text-xl font-medium">Reviews</h2>
        <ul className="mt-m-l flex flex-col gap-l-xl">
          {reviews.map(
            ({ id, customer, content, rating, createdAt }, index) => {
              if (!content) {
                console.error(
                  "review content is not defined for review %d",
                  id,
                );
                return <Fragment key={index} />;
              }

              return (
                <li className="flex items-start gap-s-m" key={index}>
                  <div className="relative h-xl-2xl w-xl-2xl overflow-hidden rounded-3xl">
                    <ZoozImage
                      src={getCustomerImage(customer?.profilePicture)}
                      alt={customer?.name ?? t("customer-avatar")}
                      title={customer?.name ?? t("customer-avatar")}
                      fill
                      sizes="(min-width: 1340px) 50px, (min-width: 620px) calc(1.71vw + 27px), calc(7.67vw - 8px)"
                      quality={65}
                    />
                  </div>
                  <div className="w-full self-center leading-[1.2rem]">
                    <div className="flex items-center gap-3xs-2xs">
                      <h3 className="text-lg text-gray-400">
                        {customer?.name ?? t("unknown-customer")}
                      </h3>

                      {createdAt && (
                        <Time
                          dateTime={createdAt}
                          className="text-base font-extralight text-gray-400"
                        />
                      )}
                    </div>
                    <p className="mt-2xs-xs max-w-[50ch] text-lg text-on-primary-1/80">
                      {content}
                    </p>
                  </div>
                </li>
              );
            },
          )}
        </ul>
        <WriteReviewButton agency={agency} />
      </article>
    </Section>
  );
}
