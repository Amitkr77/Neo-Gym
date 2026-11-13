import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center bg-ink pt-[72px] text-white">
        <div className="container-x">
          <p className="display text-[8rem] leading-none text-white/10 sm:text-[14rem]" aria-hidden="true">404</p>
          <h1 className="display -mt-6 text-4xl sm:-mt-12 sm:text-6xl">
            Page not found. <span className="accent text-ember">Off track.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/70">
            The page you are looking for doesn&apos;t exist or has moved.
          </p>
          <Link to="/" className="btn-primary mt-10">Back to home</Link>
        </div>
      </main>
    </>
  );
}
