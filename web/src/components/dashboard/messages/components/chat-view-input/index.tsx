"use client";

import Button from "@/components/shared/button";
import ZoozInput from "@/components/shared/zooz-input";
import { useUser } from "@/lib/context/user";
import { useDashboardMessagesStore } from "@/lib/store/dashboard-messages";
import { TSocketError, TSocketMessage, TZoozieUserMessage } from "@/lib/types";
import { isEmptyObject, showToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useRef, useState } from "react";

export function ChatViewInput() {
  const t = useTranslations("dashboard.messages");
  const ws = useRef<WebSocket>();
  const [input, setInput] = useState("");

  const appendMessage = useDashboardMessagesStore(
    (state) => state.appendMessage,
  );
  const conversation = useDashboardMessagesStore((state) => state.conversation);
  const customerId = conversation?.customerId;
  const { accessToken } = useUser();

  useEffect(() => {
    connect();
    return function cleanup() {
      ws?.current?.close(1000, "Bye!");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  function connect(): void {
    if (!customerId) return;

    const socket = new WebSocket(
      // TODO: use an OTP token
      `ws://localhost:42069/api/en/conversations/chat/${customerId}?token=${accessToken.value}`,
    );
    ws.current = socket;

    socket.onopen = function onopen() {
      console.info("[WS]: WebSocket connected");
    };

    socket.onmessage = function onmessage(e) {
      const socketMessage: TSocketMessage = JSON.parse(e.data);

      const err = socketMessage.error;
      if (err && !isEmptyObject(err)) {
        handleSocketError(err);
        return;
      }

      appendMessage({
        conversationId: conversation.id,
        ...socketMessage.message,
      });
    };

    socket.onclose = function onclose(e: CloseEvent) {
      console.info("[WS]: WebSocket closed. reason: ", e.reason);
      ws.current = undefined;

      if (e.reason !== "Bye!") {
        console.info("[WS]: WebSocket reconnecting ..");
        connect();
      }
    };

    socket.onerror = function onerror(e) {
      console.error("[WS]: WebSocket error", e);
      socket.close();
    };
  }

  function handleSocketError(e: TSocketError) {
    console.error("[WS] socket error", e);

    const unknownErr: TZoozieUserMessage = {
      status: "failure",
      message: t("something-went-wrong"),
    };

    switch (e.code) {
      // NOTE: these are statuses from the server, so `READ_FAILURE` indicates that the server
      // couldn't read our sent message and `SEND_FAILURE` indicates that the server couldn't
      // send us the message i.e. we cannot read an incoming message.
      case "SEND_FAILURE":
        showToast({ status: "failure", message: t("read-failure") });
        break;
      case "READ_FAILURE":
        showToast({ status: "failure", message: t("write-failure") });
        break;
      case "INTERNAL_FAILURE":
      case "UNRECOGNIZED_MESSAGE_TYPE":
      case "UNAUTHENTICATED":
      case "INVALID_TOKEN":
      default:
        showToast(unknownErr);
    }
  }

  function send() {
    if (!ws.current) {
      showToast({ status: "failure", message: t("write-failure") });
      return;
    }

    if (input.trim() !== "") {
      const payload = {
        message: {
          type: "TEXT",
          content: input,
        },
      };

      console.info("[WS]: Sent message", payload.message.content);
      ws.current.send(JSON.stringify(payload));
      setInput("");
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send();
  }

  return (
    <section className="mt-auto space-y-s-m border-t border-gray-300 pt-s-m">
      <form onSubmit={handleSubmit}>
        <ZoozInput
          id="message-input"
          label={t("message-input")}
          labelClassName="sr-only"
          containerClassName="border-none"
          type="text"
          placeholder={t("write-your-message")}
          value={input}
          onChange={({ target: { value } }) => setInput(value)}
        />

        <Button type="submit" className="ms-auto">
          {t("send")}
        </Button>
      </form>
    </section>
  );
}
