"use client";
import { useEffect, ReactNode } from "react";
import gsap from "gsap";

const ScrollReveal = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 60, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
          );
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
          gsap.set(entry.target, { opacity: 0, y: 60, scale: 0.95 });
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <>{children}</>;
};

export default ScrollReveal; 