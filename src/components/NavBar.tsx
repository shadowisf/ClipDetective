import { useState } from "react";
import { Help } from "./Modal";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <nav className="absolute text-black justify-between flex pt-3 pb-3 ps-5 pe-5 w-screen text-xl font-bold">
      <Link to="/">⬅️ clip detective</Link>
      <button onClick={() => setIsHelpOpen(true)}>help ℹ️</button>
      <Help isModalOpen={isHelpOpen} setIsModalOpen={setIsHelpOpen} />
    </nav>
  );
}
