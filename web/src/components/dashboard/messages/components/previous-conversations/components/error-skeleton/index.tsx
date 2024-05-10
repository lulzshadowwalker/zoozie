import { ChatTileSkeleton } from "../../../chat-tile-skeleton";

export default function LoadingSkeleton() {
  return (
    <section className="w-full max-w-[40rem] space-y-xs-s overflow-scroll border-e border-gray-100 px-s-m py-m-l">
      {[...Array(69)].map((_, index) => (
        <ChatTileSkeleton key={index} />
      ))}
    </section>
  );
}
