import Starfield from "@/components/Starfield";
import FocusApp from "@/components/FocusApp";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="relative z-10">
        <FocusApp />
      </div>
    </main>
  );
}
