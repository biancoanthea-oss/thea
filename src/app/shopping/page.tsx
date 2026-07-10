import Link from "next/link";
import ShoppingList from "@/components/ShoppingList";

export const metadata = {
  title: "AI Shopping List — cheapest Dublin prices",
  description:
    "Type your grocery list, set a budget, and find the cheapest Dublin supermarket to shop at.",
};

export default function ShoppingPage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-10">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-blush">
            Dublin · Ireland
          </p>
          <h1 className="mt-3 py-2 font-script text-6xl leading-[1.2] text-sage-dark sm:text-7xl">
            Smart Shopping List
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            Type what you need, set a budget, and we&apos;ll find the cheapest
            supermarket to do your shop — Tesco, Dunnes, SuperValu, Lidl or Aldi.
          </p>
        </header>

        <section className="rounded-3xl bg-white/40 p-6 shadow-sm ring-1 ring-sage/10 sm:p-8">
          <ShoppingList />
        </section>

        <footer className="mt-8 text-center">
          <Link
            href="/"
            className="text-sage-dark underline-offset-4 hover:underline"
          >
            ← Back home
          </Link>
        </footer>
      </div>
    </main>
  );
}
