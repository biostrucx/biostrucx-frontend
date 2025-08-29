// src/components/AboutUs.jsx
// React + Tailwind + Framer Motion
import React from "react";
import { motion } from "framer-motion";

const Section = ({ id, kicker, title, children }) => (
  <section id={id} className="w-full max-w-6xl mx-auto px-4 py-20">
    {kicker && (
      <p className="text-xs tracking-widest uppercase text-white/60 mb-3">
        {kicker}
      </p>
    )}
    {title && (
      <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8">
        {title}
      </h2>
    )}
    {children}
  </section>
);

// Placeholder for videos/renders you’ll drop in later
const VideoSlot = ({ label, aspect = "aspect-video" }) => (
  <div
    className={`w-full ${aspect} rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center`}
  >
    <span className="text-white/50 text-sm">{label}</span>
  </div>
);

export default function AboutUs() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          {/* Space for background video if you want */}
          {/* <video className="w-full h-full object-cover" autoPlay loop muted playsInline src="YOUR_VIDEO.mp4" /> */}
        </motion.div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-32">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            About <span className="text-white/70">BioStrucX</span>
          </h1>
          <p className="mt-6 text-white/70 max-w-2xl">
            Intelligent sensors, living digital twins and our own AI to predict
            failures in a world under pressure.
          </p>
        </div>
      </div>

      {/* Section 1 – The Global Problem */}
      <Section id="problem" kicker="Section 1" title="The Global Problem">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-white/80">
              “Our planet faces a future of aging infrastructures and climate
              change. Each collapse costs millions and human lives. Engineering
              can no longer react afterwards: we need structures that feel and
              act before failure.”
            </p>
            <ul className="text-white/60 list-disc ml-6 space-y-2">
              <li>Bridges, buildings and tunnels with silent risk.</li>
              <li>Maintenance budgets often too late and insufficient.</li>
              <li>Need for real early warning and prediction.</li>
            </ul>
          </motion.div>

          {/* VIDEO SLOT: collapsed bridge + digital twin alert */}
          <VideoSlot label="VIDEO 1 — Collapsed bridge → cut to digital twin with red alert" />
        </div>
      </Section>

      {/* Section 2 – Our Solution */}
      <Section id="solution" kicker="Section 2" title="Our Solution">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* RENDER SLOT: BSX–FARADAY1™ 3D */}
          <VideoSlot label="RENDER/VIDEO 2 — BSX–FARADAY1™ spinning (Blender/AE)" />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-white/80">
              “BioStrucX develops intelligent sensors and living digital twins
              that enable structures to feel, evolve and self-regulate in real
              time.”
            </p>
            <ul className="text-white/60 list-disc ml-6 space-y-2">
              <li>BSX–FARADAY1™: displacement with micron resolution.</li>
              <li>
                Live dashboard: real vs simulated data, thresholds and alerts.
              </li>
              <li>Integration with structural models and decision flows.</li>
            </ul>

            {/* SCREEN CAPTURE SLOT: Dashboard in action */}
            <VideoSlot
              label="SCREEN CAPTURE — BioStrucX Live Dashboard (real vs simulated displacement)"
              aspect="aspect-[16/9]"
            />
          </motion.div>
        </div>
      </Section>

      {/* Section 3 – Our Mission */}
      <Section id="mission" kicker="Section 3" title="Our Mission">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <blockquote className="text-2xl md:text-3xl text-white/90">
              “If we do it, we prevent collapses and reduce carbon; if we don’t,
              nobody will. That is our commitment.”
            </blockquote>
            <p className="text-white/60">
              A manifesto for a new era: engineering that prevents, protects and
              extends the life of our structures.
            </p>
          </motion.div>

          {/* VIDEO SLOT: futuristic skyline */}
          <VideoSlot label="VIDEO 3 — Futuristic skyline at night (Pexels)" />
        </div>
      </Section>

      {/* Section 4 – How we will do it */}
      <Section id="how" kicker="Section 4" title="How We Will Do It">
        <p className="text-white/80 mb-10">
          Our plan combines precision hardware, a customized platform per
          client, a living digital twin and our own AI that provides continuous
          support. This is not a promise: it’s execution.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">1) Disruptive Sensors</h3>
              <p className="text-white/70">
                <strong>BSX–FARADAY1™</strong> turns every micron of movement
                into reliable data, operating in extreme environments to connect
                the physical structure with its digital world.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                2) Customized Platform per Client
              </h3>
              <p className="text-white/70">
                Each client accesses a <strong>tailored platform</strong> with
                their own <strong>living digital twin</strong>. A private space
                showing:
              </p>
              <ul className="text-white/60 list-disc ml-6 mt-3 space-y-2">
                <li>Real-time condition (displacements, vibrations, stresses).</li>
                <li>Comparison between real vs simulated data.</li>
                <li>Automatic alerts and event traceability.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                3) ELY — BioStrucX.ai Artificial Intelligence
              </h3>
              <p className="text-white/70">
                <strong>ELY</strong> learns from each structure and provides
                continuous support:
              </p>
              <ul className="text-white/60 list-disc ml-6 mt-3 space-y-2">
                <li>For construction firms: live monitoring and insights.</li>
                <li>For engineers: a copilot integrated with ETABS, STAAD, SAFE.</li>
                <li>
                  For academia: a structural research assistant of new
                  generation.
                </li>
              </ul>
              <p className="text-white/60 mt-2">
                ELY is not a chatbot: it is the <em>operating brain</em> that
                supports every decision.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">4) Living Digital Twin</h3>
              <p className="text-white/70">
                Finite element models updated in seconds with sensor data to{" "}
                <strong>predict failures</strong> and{" "}
                <strong>trigger alerts</strong> before they occur.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">5) Global Scale-Up</h3>
              <ul className="text-white/60 list-disc ml-6 space-y-2">
                <li>
                  <strong>2025</strong> — Lab pilots, beta of customized
                  platform.
                </li>
                <li>
                  <strong>2026</strong> — Public demo: living digital twin
                  connected to ELY.
                </li>
                <li>
                  <strong>2027–2030</strong> — Rollout in critical
                  infrastructures worldwide.
                </li>
                <li>
                  <strong>2030+</strong> — Extreme environments on Earth and
                  Mars.
                </li>
              </ul>
            </div>
          </div>

          {/* ANIMATION SLOT: Sensor → ELY → Twin → Alerts */}
          <div className="space-y-6">
            <VideoSlot label="ANIMATION 4 — Flow: Sensor → Platform (client) → ELY (AI) → Digital Twin → Alerts" />
            <p className="text-white/50 text-sm">
              Tip: look at Envato/Videohive “futuristic data flow / AI network
              visualization” and customize with your labels.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 5 – Inspirational Roadmap */}
      <Section id="roadmap" kicker="Section 5" title="Inspirational Roadmap">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <ul className="text-white/80 space-y-3">
              <li>
                <strong>2025</strong> → Validation of BSX–FARADAY1™ and beta of
                ELY platform.
              </li>
              <li>
                <strong>2026</strong> → First public demo of a living digital
                twin.
              </li>
              <li>
                <strong>2027–2030</strong> → Scale-up to bridges, tunnels,
                critical buildings.
              </li>
              <li>
                <strong>2030+</strong> → Intelligent infrastructures on Earth
                and Mars.
              </li>
            </ul>
          </div>

          {/* TIMELINE SLOT */}
          <VideoSlot label="ANIMATION 5 — Timeline with scroll (Lottie/Codepen)" />
        </div>
      </Section>

      {/* Section 6 – Call to Action */}
      <Section id="cta" kicker="Section 6" title="Be Part of the Change">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-white/80">
              We are not just building sensors: we are building the future of
              structural engineering. Join us to pilot, research or deploy
              BioStrucX in your infrastructure.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* These buttons can link to /contact, /partnerships, etc. */}
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90"
              >
                Contact
              </a>
              <a
                href="/partnerships"
                className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5"
              >
                Partnerships
              </a>
            </div>
          </div>

          {/* EPIC VIDEO SLOT */}
          <VideoSlot label="VIDEO 6 — Rocket launch slow motion (Pexels) — metaphor of launch" />
        </div>
      </Section>

      <footer className="border-t border-white/10 py-10 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} BioStrucX — Structures that feel, evolve &
        self-regulate.
      </footer>
    </div>
  );
}
