import Button from "@/components/shared/button";
import ZoozInput from "@/components/shared/zooz-input";
import { useUser } from "@/lib/context/user";
import { useCustomerMessagesStore } from "@/lib/store/customer-messages";
import { TSocketMessage, TSocketError, TZoozieUserMessage } from "@/lib/types";
import { isEmptyObject, showToast } from "@/lib/utils";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, FormEvent } from "react";

export default function ChatViewInput() {
  const t = useTranslations("customer.messages");
  const ws = useRef<WebSocket>();
  const [input, setInput] = useState("");

  const appendMessage = useCustomerMessagesStore(
    (state) => state.appendMessage,
  );
  const conversation = useCustomerMessagesStore((state) => state.conversation);
  const agencyId = conversation?.agencyId;
  const { accessToken } = useUser();

  useEffect(() => {
    connect();
    return function cleanup() {
      ws?.current?.close(1000, "Bye!");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  function connect(): void {
    if (!agencyId) return;

    const socket = new WebSocket(
      // TODO: use an OTP token
      `ws://localhost:42069/api/en/conversations/chat/${agencyId}?token=${accessToken.value}`,
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
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t-[0.5px] border-gray-300"
    >
      <ZoozInput
        id="chat-input"
        label="Send a message"
        labelClassName="sr-only"
        containerClassName="border-0 py-xs-s"
        inputClassName="placeholder:text-[1.35rem]"
        type="text"
        placeholder={t("write-your-message")}
        value={input}
        onChange={({ target: { value } }) => setInput(value)}
      />

      <Button className="ms-auto flex h-full items-center justify-center rounded-none rounded-ss-3xl text-gray-50">
        <FontAwesomeIcon
          icon={faPaperPlane}
          size="lg"
          className="text-gray-50 rtl:scale-x-[-1]"
        />
      </Button>
    </form>
  );
}
