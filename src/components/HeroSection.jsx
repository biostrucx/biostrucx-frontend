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

      {/* Capa oscura de superposición para mayor contraste */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10" />

      {/* Contenido sobre el video */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Structures that Think.
          <br />
          Materials that Heal.
          <br />
          A Planet that Breathes.
          </h1>
        </div>
      {/* Modal de login por SMS */}
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
