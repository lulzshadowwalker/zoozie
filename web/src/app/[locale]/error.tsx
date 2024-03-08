"use client"; 

import { Link } from "@/lib/i18n/navigation";

export default function InternalServerError() {
    return (
        <main className="min-h-screen min-w-screeen flex flex-col items-center justify-center">
            <h1 className="text-4xl">Oops! Something went wrong.</h1>
            <Link href="/" className="text-lg">Return Home </Link>
        </main>
    );
}
