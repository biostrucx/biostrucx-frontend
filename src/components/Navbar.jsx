import React, { useState } from "react";
import LiveLoginModal from "./LiveLoginModal";

function HeroSection() {
  const [showModal, setShowModal] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://res.cloudinary.com/di4esyfmv/video/upload/v1750195850/uetvdyeh8r8avpywz30j.mp4"
      />

      {/* Capa oscura de superposición */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10" />

      {/* Contenido sobre el video */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug drop-shadow-lg max-w-3xl mx-auto">
          Structures that Think.
          <br />
          Materials that Heal.
          <br />
          A Planet that Breathes.
        </h1>

        {/* Botón opcional para login */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-8 px-6 py-3 bg-cyan-500 hover:bg-cyan-700 text-white rounded-full font-semibold shadow-lg transition duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Modal de login */}
      {showModal && !isLogged && (
        <LiveLoginModal
          onSuccess={() => {
            setIsLogged(true);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

export default HeroSection;

