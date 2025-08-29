import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Waves, Activity } from "lucide-react";
import EarthVideo from "../assets/earth-loop.mp4";

export default function GlobalWarming() {
  const vidRef = useRef(null);

  useEffect(() => {
    const tryPlay = () => vidRef.current?.play?.().catch(() => {});
    tryPlay();
    const onTouch = () => { tryPlay(); window.removeEventListener("touchend", onTouch); };
    const onVis = () => { if (document.visibilityState === "visible") tryPlay(); };
    window.addEventListener("touchend", onTouch, { once: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("touchend", onTouch);
    };
  }, []);

  const cards = [/* …tus cards… */];
  const stats = [/* …tus stats… */];

  return (
    <section className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden bg-black text-white">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={vidRef}
          className="h-full w-full object-contain md:object-cover opacity-80"
          src={EarthVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      {/* …tu contenido existente (sin cambios)… */}
    </section>
  );
}

