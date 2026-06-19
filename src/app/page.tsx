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
          <h1 className="mt-2 font-script text-6xl leading-tight text-sage-dark sm:text-7xl">
            {COUPLE_NAME}
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3 text-sage/70">
            <span className="h-px w-12 bg-sage/40" />
            <span className="text-xl">❀</span>
            <span className="h-px w-12 bg-sage/40" />
          </div>
          <p className="mt-5 text-lg text-stone-600">
            Share the moments you capture today. Upload your photos and videos
            below — no app, no login. Thank you for celebrating with us. ♥
          </p>
        </header>

        <section className="rounded-3xl bg-white/40 p-6 shadow-sm ring-1 ring-sage/10 sm:p-8">
          <GuestExperience />
        </section>

        <footer className="mt-10 text-center text-sm">
          <nav className="mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/gallery"
              className="text-sage-dark underline-offset-4 hover:underline"
            >
              View gallery
            </Link>
            <Link
              href="/slideshow"
              className="text-sage-dark underline-offset-4 hover:underline"
            >
              Slideshow
            </Link>
            <Link
              href="/guestbook"
              className="text-sage-dark underline-offset-4 hover:underline"
            >
              Guestbook
            </Link>
          </nav>
          <p className="text-stone-400">Made with love for {COUPLE_NAME}</p>
        </footer>
      </div>
    </main>
  );
}
