import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to #section targets (e.g. /#services) and to the top on page changes.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a frame so the target section has rendered.
    const id = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}
