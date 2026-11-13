import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTarget } from "../../lib/smoothScroll";

// Scrolls to #section targets (e.g. /#services) and to the top on page changes.
// Goes through the smooth-scroll helper so anchor jumps ease like wheel scrolling.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToTarget(0, { immediate: true });
      return;
    }
    // Wait a frame so the target section has rendered.
    const id = requestAnimationFrame(() => {
      const el = document.getElementById(hash.slice(1));
      if (el) scrollToTarget(el);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}
