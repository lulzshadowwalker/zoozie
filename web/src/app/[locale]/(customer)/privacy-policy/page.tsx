
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("privacy-policy");

  return (
    <div className="bg-primary-1 py-2xl">
      <div className="prose prose-2xl mx-auto max-w-screen-lg text-on-primary-1 dark:prose-invert">
        <h1>{t("title")}</h1>
        <p>{t("last-updated")}</p>
        <p>{t("introduction")}</p>
        <h2>{t("information-we-collect.title")}</h2>
        <p>{t("information-we-collect.introduction")}</p>
        <ul>
          <li>{t("information-we-collect.personal-information")}</li>
          <li>{t("information-we-collect.usage-data")}</li>
          <li>{t("information-we-collect.cookies")}</li>
        </ul>
        <h2>{t("how-we-use-your-information.title")}</h2>
        <p>{t("how-we-use-your-information.introduction")}</p>
        <ul>
          <li>{t("how-we-use-your-information.provide-services")}</li>
          <li>{t("how-we-use-your-information.improve-services")}</li>
          <li>{t("how-we-use-your-information.communication")}</li>
          <li>{t("how-we-use-your-information.legal-compliance")}</li>
        </ul>
        <h2>{t("sharing-your-information.title")}</h2>
        <p>{t("sharing-your-information.introduction")}</p>
        <ul>
          <li>{t("sharing-your-information.third-party-providers")}</li>
          <li>{t("sharing-your-information.legal-requirements")}</li>
          <li>{t("sharing-your-information.business-transfers")}</li>
        </ul>
        <h2>{t("your-choices.title")}</h2>
        <p>{t("your-choices.introduction")}</p>
        <ul>
          <li>{t("your-choices.cookies")}</li>
          <li>{t("your-choices.marketing-communications")}</li>
        </ul>
        <h2>{t("security.title")}</h2>
        <p>{t("security.introduction")}</p>
        <h2>{t("childrens-privacy.title")}</h2>
        <p>{t("childrens-privacy.introduction")}</p>
        <h2>{t("changes-to-this-policy.title")}</h2>
        <p>{t("changes-to-this-policy.introduction")}</p>
        <h2>{t("contact-us.title")}</h2>
        <p>{t("contact-us.introduction")}</p>
      </div>
    </div>
  );
}
