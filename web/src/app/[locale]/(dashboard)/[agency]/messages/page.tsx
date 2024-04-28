import UserAvatar from "@/components/customer/shared/header-navigation-bar/components/user-avatar";
import Header from "@/components/dashboard/shared/header";
import Button from "@/components/shared/button";
import ZoozImage from "@/components/shared/zooz-image";
import ZoozInput from "@/components/shared/zooz-input";
import { IBasePageParams } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { HTMLAttributes } from "react";

export default async function Messages({
  params: { locale },
}: IBasePageParams) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("dashboard.messages");

  return (
    <main>
      <Header leading={<h1 className="text-2xl">{t("messages")}</h1>} />
      <section className="flex h-[calc(100dvh-7.412rem)]">
        <section className="w-full max-w-[40rem] space-y-xs-s overflow-scroll border-e border-gray-100 px-s-m py-m-l">
          {[...Array(20)].map((_, index) => (
            <ChatTile key={index} active={index === 0} />
          ))}
        </section>
        <ChatView />
      </section>
    </main>
  );
}

interface ChatTileProps extends HTMLAttributes<HTMLElement> {
  active?: boolean;
}

async function ChatTile({ active, className, ...rest }: ChatTileProps) {
  const t = await getTranslations("dashboard.messages");

  return (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-xs-s rounded-2xl p-s-m transition-all hover:bg-gray-100",
        className,
        {
          "cursor-default bg-gray-100": active,
        },
      )}
      {...rest}
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

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Charlie Bradtke</h2>
          <time
            dateTime="2022-02-22T12:22:00"
            className="text-base font-light text-gray-500"
          >
            Feb 22, 2022
          </time>
        </div>
        <p className="line-clamp-2 text-lg font-light leading-[2.4rem] text-gray-500">
          Hello, I just wanted to see if we could possibly arrange a meeting
          sometime soon ?
        </p>
      </div>
    </div>
  );
}

async function ChatView() {
  const t = await getTranslations("dashboard.messages");

  return (
    <section className="flex flex-grow flex-col bg-gray-200 p-l-xl">
      <ChatViewHeader />
      <ChatViewBody />
      <ChatViewInput />
    </section>
  );
}

async function ChatViewInput() {
  const t = await getTranslations("dashboard.messages");

  return (
    <section className="mt-auto space-y-s-m border-t border-gray-300 pt-s-m">
      <ZoozInput
        id="message-input"
        label={t("message-input")}
        labelClassName="sr-only"
        containerClassName="border-none"
        type="text"
        placeholder={t("write-your-message")}
      />

      <Button type="button" className="ms-auto">
        {t("send")}
      </Button>
    </section>
  );
}

async function ChatViewHeader() {
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

async function ChatViewBody() {
  return (
    <section className="my-l-xl space-y-l-xl overflow-y-auto scrollbar-hide">
      {[...Array(15)].map((_, index) => (
        <ChatViewMessage key={index} sender={index % 2 === 0} />
      ))}
    </section>
  );
}

type ChatViewMessageProps = {
  sender?: boolean;
};

async function ChatViewMessage({ sender }: ChatViewMessageProps) {
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
