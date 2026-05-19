import { useEffect, useRef, useState } from "react";

export function useInView(): {
  ref: React.RefObject<HTMLElement>;
  isInView: boolean;
} {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Guard for environments without IntersectionObserver (SSR, jsdom without mock)
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}
