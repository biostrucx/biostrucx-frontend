// src/components/GlobalWarming.jsx
import React from "react";
import warmingImage from "../assets/global-warming.png"; // your image in assets

export default function GlobalWarming() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Global Warming</h1>
      
      <div className="max-w-3xl w-full">
        <img
          src={warmingImage}
          alt="The different futures that await us"
          className="rounded-2xl shadow-lg w-full"
        />
      </div>

      <p className="mt-6 text-lg text-gray-300 text-center">
        This chart illustrates the scenarios of global temperature rise and 
        the different futures that await us if urgent climate action is not taken.
      </p>
    </div>
  );
}
