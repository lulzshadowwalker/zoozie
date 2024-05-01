import ZoozImage from "@/components/shared/zooz-image";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type ChatViewMessageProps = {
  sender?: boolean;
};

export async function ChatViewMessage({ sender }: ChatViewMessageProps) {
  const t = await getTranslations("dashboard.messages");
  const receiver = !sender;

  return (
    <div
      className={cn("flex max-w-[55rem] items-start gap-s-m", {
        "ms-auto flex-row-reverse": sender,
      })}
    >
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

      <p
        className={cn(
          "rounded-3xl bg-primary-1/50 p-xs-s",
          {
            "rounded-tr-none": sender,
          },
          {
            "rounded-tl-none bg-primary-1/50": receiver,
          },
        )}
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
        nihil placeat tempore explicabo consequuntur ea officia corrupti in
        nostrum libero magni, quae est facere nobis! Cum sit dolorum repudiandae
        eligendi?
      </p>
    </div>
  );
}
