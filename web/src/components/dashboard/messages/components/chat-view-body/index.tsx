import { ChatViewMessage } from "../chat-view-message";

export async function ChatViewBody() {
  return (
    <section className="my-l-xl space-y-l-xl overflow-y-auto scrollbar-hide">
      {[...Array(15)].map((_, index) => (
        <ChatViewMessage key={index} sender={index % 2 === 0} />
      ))}
    </section>
  );
}
