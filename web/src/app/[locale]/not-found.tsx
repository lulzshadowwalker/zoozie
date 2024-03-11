import { Link } from "@/lib/i18n/navigation";

// TODO: Design a better not-found page 
// TODO: Override the default not-found page for routes outside of [locale]
export default function NotFound() {
    return (
      <main className="min-h-screen min-w-screeen flex flex-col items-center justify-center">
        <h1 className="text-4xl">are you lost, sailor?</h1>
        <Link href="/" className="text-lg underline hover:decoration-transparent">Return Home </Link>
      </main>
    );
}
