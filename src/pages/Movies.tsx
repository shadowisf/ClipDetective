import { Fragment } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Movies() {
  return (
    <Fragment>
      <NavBar />
      <div className="flex justify-center items-center text-3xl font-bold h-screen">
        movies section coming soon!
      </div>
      <Footer />
    </Fragment>
  );
}
