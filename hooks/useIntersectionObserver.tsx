import { useEffect, useRef, useState } from 'react';

function useIntersectionObserver(callback: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetRef) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    observerRef.current.observe(targetRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [targetRef, callback]);

  return setTargetRef;
}

export default useIntersectionObserver;
