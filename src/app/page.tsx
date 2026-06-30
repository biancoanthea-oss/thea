import RecipeExtractor from "@/components/RecipeExtractor";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-carrot">
            Recipe → Groceries
          </p>
          <h1 className="mt-3 font-display text-5xl leading-tight text-herb-dark sm:text-6xl">
            Pantry Snap
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-stone-600">
            Found a recipe video or screenshot you love? Drop it in and get a
            tidy shopping list of everything you need to buy.
          </p>
        </header>

        <RecipeExtractor />

        <footer className="mt-12 text-center text-sm text-stone-400">
          <p>Reads on-screen text and what&apos;s being cooked to build your list.</p>
          <p className="mt-1">
            Saved lists stay private on this device. Powered by Claude.
          </p>
        </footer>
      </div>
    </main>
  );
}
