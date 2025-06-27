import { IBasePageParams } from "@/lib/types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function TermsAndConditions({ params: { locale } }: IBasePageParams) {
  unstable_setRequestLocale(locale); 
  const t = await getTranslations("terms-and-conditions");

  return (
    <div className="bg-primary-1 py-2xl">
      <div className="prose prose-2xl mx-auto max-w-screen-lg text-on-primary-1 dark:prose-invert px-8 max-md:prose-lg">
        <h1>{t("title")}</h1>
        <p>{t("last-updated")}</p>
        <h2>{t("agreement.title")}</h2>
        <p>{t("agreement.introduction")}</p>
        <h2>{t("accounts.title")}</h2>
        <p>{t("accounts.introduction")}</p>
        <h2>{t("user-content.title")}</h2>
        <p>{t("user-content.introduction")}</p>
        <h2>{t("prohibited-activities.title")}</h2>
        <p>{t("prohibited-activities.introduction")}</p>
        <ul>
          <li>{t("prohibited-activities.illegal-activities")}</li>
          <li>{t("prohibited-activities.spam")}</li>
          <li>{t("prohibited-activities.harmful-content")}</li>
        </ul>
        <h2>{t("intellectual-property.title")}</h2>
        <p>{t("intellectual-property.introduction")}</p>
        <h2>{t("termination.title")}</h2>
        <p>{t("termination.introduction")}</p>
        <h2>{t("disclaimer.title")}</h2>
        <p>{t("disclaimer.introduction")}</p>
        <h2>{t("limitation-of-liability.title")}</h2>
        <p>{t("limitation-of-liability.introduction")}</p>
        <h2>{t("governing-law.title")}</h2>
        <p>{t("governing-law.introduction")}</p>
        <h2>{t("changes-to-terms.title")}</h2>
        <p>{t("changes-to-terms.introduction")}</p>
        <h2>{t("contact-us.title")}</h2>
        <p>{t("contact-us.introduction")}</p>
      </div>
    </div>
  );
}
