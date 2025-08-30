// src/components/GlobalWarming.jsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Waves, Activity } from "lucide-react";

// ❌ Quitamos el video local
// import EarthVideo from "../assets/earth-loop.mp4";

export default function GlobalWarming() {
  const cards = [
    {
      key: "sustainable",
      title: "Sustainable Path",
      tag: "Preferred",
      tone: "from-emerald-400/30 to-emerald-300/10",
      accent: "bg-emerald-400/60",
      stat: "< 1.5°C",
      blurb:
        "Design + monitoring + smart materials. Keep assets efficient, resilient and measurable.",
    },
    {
      key: "critical",
      title: "Critical Path",
      tag: "Risk rising",
      tone: "from-amber-400/30 to-amber-300/10",
      accent: "bg-amber-400/60",
      stat: "+ 2.0–2.5°C",
      blurb:
        "Higher loads, fatigue and deflections. Real-time data becomes essential for decisions.",
    },
    {
      key: "failure",
      title: "Failure Path",
      tag: "Unacceptable",
      tone: "from-rose-500/30 to-rose-400/10",
      accent: "bg-rose-500/60",
      stat: "> 3.0°C",
      blurb:
        "Cascading damage and costly retrofits. Autonomous SHM is survival tech—avoid this future.",
    },
  ];

  const stats = [
    { icon: Globe2, label: "Climate focus", value: "Structures first" },
    { icon: Waves, label: "Sea-level data", value: "Live soon" },
    { icon: Activity, label: "Sensor twin", value: "Real-time ready" },
  ];

  // ✅ Cloudinary (asset directo, no embed)
  const VIDEO_SRC =
    "https://res.cloudinary.com/di4esyfmv/video/upload/earth-loop_wd7hay.mp4";

  return (
    <section className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden bg-black text-white">
      {/* ===== Background video capa ===== */}
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-contain md:object-cover opacity-80"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Overlays más suaves para no ocultar el video */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      {/* ===== Contenido por encima del video ===== */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Global Warming
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            BioStrucX aligns structural design, smart monitoring and sustainable
            materials— a Space-grade approach for an overheated planet.
          </p>

          {/* === BOTONES ACTUALIZADOS === */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="/launchpad"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              Explore our Launchpad for Climate Innovation <ArrowRight size={18} />
            </a>
            <a
              href="/dashboard/jeimie"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Meet Our First Customer
            </a>
          </div>
        </motion.div>

        {/* Future paths */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c, idx) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-b ${c.tone} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold md:text-2xl">{c.title}</h3>
                <span
                  className={`rounded-full ${c.accent} px-2.5 py-1 text-xs font-semibold text-black/90`}
                >
                  {c.tag}
                </span>
              </div>
              <div className="mt-10 text-6xl font-extrabold tracking-tight md:text-7xl">
                {c.stat}
              </div>
              <p className="mt-4 text-sm text-white/75">{c.blurb}</p>
              <div className="mt-8 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-white/60 to-white/0 transition-transform duration-300 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>

        {/* Status strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
        >
          <div className="grid items-center gap-4 md:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <s.icon className="h-5 w-5 opacity-80" />
                <div className="text-sm">
                  <div className="text-white/70">{s.label}</div>
                  <div className="font-semibold">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footnote */}
        <p className="mx-auto max-w-3xl text-center text-sm font-medium bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Through advanced sensors and integrated biomaterials, BioStrucX Live
          monitors how structures adapt over time, preventing unnecessary
          demolitions and reducing carbon emissions, while integrating renewable
          energy systems like solar-powered sensors for sustainable projects.
        </p>
      </div>
    </section>
  );
}

