import { useTranslations } from "next-intl";
import { BasePageParams } from "@/lib/types/types";
import { Link } from "@/lib/i18n/navigation";

export default function Home({ params: { locale } }: any) {
  const t = useTranslations();
  const flippedLocale = locale === "ar" ? "en" : "ar";

  return (
    <main className="min-w-screen min-h-screen flex flex-col justify-center items-center gap-xs-s">
      <article className="max-w-readable mx-auto">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        velit quas vero esse suscipit nam nihil cumque eius dicta fugit, facere
        autem, amet reiciendis voluptatibus voluptas sit ex praesentium porro!
      </article>
      <h1 className="text-4xl">{t("hello")}</h1>
      <Link
        href="/"
        locale={flippedLocale}
        className="bg-cyan-500 rounded-full aspect-square h-xl-2xl flex justify-center items-center text-lg text-white font-medium"
      >
        {flippedLocale.toUpperCase()}
      </Link>
    </main>
  );
}
