import { ChatTileSkeleton } from "../chat-tile/components/chat-title-skeleton";

export default function LoadingSkeleton() {
  return (
    <section className="w-full max-w-[40rem] space-y-s-m overflow-scroll border-e border-gray-100 px-s-m py-m-l">
      {[...Array(69)].map((_, index) => (
        <ChatTileSkeleton key={index} />
      ))}
    </section>
  );
}
