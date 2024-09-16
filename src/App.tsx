import { useState } from "react";
import { Help } from "./components/Modal";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";

export default function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <main className="flex flex-col justify-center items-center h-screen gap-10">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="font-bold text-6xl">🔍 clip detective 🕵️</h1>
        <h2>can you guess 5-second clips from movies/series?</h2>
      </div>

      <div className="flex gap-5">
        <Link
          to="/series"
          className="ps-4 pe-4 pt-2 pb-2 rounded-lg text-white font-bold bg-[#5D5D81]"
        >
          series mode 📺
        </Link>

        <Link
          to="/movies"
          className="ps-4 pe-4 pt-2 pb-2 rounded-lg text-white font-bold bg-[#5D5D81]"
        >
          movies mode 🎬 (wip)
        </Link>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="ps-4 pe-4 pt-2 pb-2 rounded-lg text-white font-bold bg-[#5D5D81]"
        >
          how to play ℹ️
        </button>
      </div>
      <Help isModalOpen={isHelpOpen} setIsModalOpen={setIsHelpOpen} />
      <Footer />
    </main>
  );
}
