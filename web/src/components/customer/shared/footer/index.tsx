import ZoozLogo from "@/components/shared/zooz-logo";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("customer.footer");
  const sections = [
    {
      title: t("resources"),
      items: [
        {
          title: t("blog"),
          href: "/blog",
        },
        {
          title: t("services"),
          href: "https://google.com",
        },
      ],
    },

    {
      title: t("follow-us"),
      items: [
        {
          title: t("facebook"),
          href: "https://facebook.com",
        },
        {
          title: t("instagram"),
          href: "https://instagram.com",
        },
      ],
    },

    {
      title: t("legal"),
      items: [
        {
          title: t("privacy-policy"),
          href: "/privacy-policy",
        },
        {
          title: t("terms-and-conditions"),
          href: "/terms-and-conditions",
        },
      ],
    },
  ] as const;

  const socials = [
    {
      title: t("facebook"),
      href: "https://facebook.com",
      icon: faFacebook,
    },

    {
      title: t("instagram"),
      href: "https://facebook.com",
      icon: faInstagram,
    },

    {
      title: t("twitter"),
      href: "https://facebook.com",
      icon: faTwitter,
    },

    {
      title: t("youtube"),
      href: "https://facebook.com",
      icon: faYoutube,
    },

    {
      title: t("pinterest"),
      href: "https://facebook.com",
      icon: faPinterest,
    },
  ] as const;

  return (
    <footer className="border-t-[0.5px] border-gray-300 bg-primary-1">
      <div className="mx-auto w-full max-w-supported px-page py-[4rem]">
        <div className="min-h-[26rem] md:flex md:justify-between">
          <div className="mb-m">
            <ZoozLogo width={140} />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-m">
            {sections.map((section, index) => (
              <section key={index}>
                <h2 className="mb-m text-lg font-semibold uppercase">
                  {section.title}
                </h2>
                <ul className="font-medium text-gray-500 dark:text-gray-400">
                  {section.items.map(({ title, href }, index) => (
                    <li className="mb-s" key={index}>
                      <Link
                        href={href}
                        rel="noreferrer noopener nofollow"
                        className={cn(
                          "text-lg outline-none transition-all hover:text-on-primary-1 focus:text-on-primary-1",
                          {
                            "text-gray-500": true,
                            "font-medium text-on-primary-1": false,
                          },
                          {
                            "cursor-not-allowed": href === null,
                          },
                        )}
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
        <hr className="lg:my-lg my-m border-gray-300 sm:mx-auto" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-lg text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 Zoozie. {t("all-rights-reserved")}.
          </span>

          <div className="mt-s flex gap-s-m sm:mt-0 sm:justify-center">
            {socials.map(({ title, href, icon }, index) => (
              <a
                key={index}
                href={href}
                title={title}
                rel="noreferrer noopener nofollow"
                className="text-gray-500 transition-all hover:text-on-primary-1 focus:text-on-primary-1 dark:text-gray-400"
              >
                <FontAwesomeIcon icon={icon} size="xl" />
                <span className="sr-only">{title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
