import GuestExperience from "@/components/GuestExperience";
import { COUPLE_NAME } from "@/lib/config";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-10">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-blush">
            Welcome to the wedding of
          </p>
          <h1 className="mt-3 py-2 font-script text-6xl leading-[1.35] text-sage-dark sm:text-7xl">
            {COUPLE_NAME}
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3 text-sage/70">
            <span className="h-px w-12 bg-sage/40" />
            <span className="text-xl">❀</span>
            <span className="h-px w-12 bg-sage/40" />
          </div>
          <p className="mt-5 text-lg text-stone-600">
            Share the moments you capture today. Upload your photos and videos
            below. Thank you for celebrating with us. ♥
          </p>
        </header>

        <section className="rounded-3xl bg-white/40 p-6 shadow-sm ring-1 ring-sage/10 sm:p-8">
          <GuestExperience />
        </section>

        <section className="mt-8 text-center">
          <p className="mb-4 text-lg text-sage-dark">
            Already shared? Take a look 💕
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/gallery"
              className="rounded-full bg-sage px-7 py-4 text-lg text-cream shadow-sm transition-colors hover:bg-sage-dark"
            >
              🖼️ View gallery
            </Link>
            <Link
              href="/slideshow"
              className="rounded-full bg-blush px-7 py-4 text-lg text-cream shadow-sm transition-colors hover:bg-blush-dark"
            >
              📽️ Slideshow
            </Link>
            <Link
              href="/guestbook"
              className="rounded-full border-2 border-sage px-7 py-4 text-lg text-sage-dark transition-colors hover:bg-sage/10"
            >
              💌 Guestbook
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/shopping"
              className="inline-block rounded-full border-2 border-blush px-7 py-4 text-lg text-blush-dark transition-colors hover:bg-blush/10"
            >
              🛒 Smart shopping list
            </Link>
          </div>
        </section>

        <footer className="mt-10 text-center text-sm text-stone-400">
          Made with love for {COUPLE_NAME}
        </footer>
      </div>
    </main>
  );
}
