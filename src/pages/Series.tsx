import { Fragment } from "react";
import NavBar from "../components/NavBar";
import ClipPlayer from "../components/ClipPlayer";
import Footer from "../components/Footer";

export default function Series() {
  return (
    <Fragment>
      <NavBar />
      <ClipPlayer type="series" />
      <Footer />
    </Fragment>
  );
}
