import ZoozImage from "@/components/shared/zooz-image";
import { getTranslations } from "next-intl/server";

export async function ChatViewHeader() {
  const t = await getTranslations("dashboard.messages");

  return (
    <div className="flex items-center gap-xs-s">
      <div className="relative min-h-xl-2xl w-full max-w-xl-2xl overflow-hidden rounded-full bg-gray-400">
        <ZoozImage
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          // TODO: add customer name to alt text
          alt={t("avatar")}
          title={t("avatar")}
          fill
          sizes="(min-width: 1320px) 38px, calc(1.7vw + 16px)"
          quality={65}
          className="object-cover"
        />
      </div>

      <h2 className="text-lg font-medium">Charlie Bradtke</h2>
    </div>
  );
}
