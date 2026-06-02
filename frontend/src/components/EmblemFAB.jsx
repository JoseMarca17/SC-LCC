import React from 'react';

export default function EmblemFAB() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="20" cy="20" r="19" stroke="#FFD100" strokeWidth="1.5" fill="none"/>
      <circle cx="20" cy="20" r="14" stroke="#0057B8" strokeWidth="1" fill="rgba(0,48,135,0.6)"/>
      {/* Alas estilizadas */}
      <path d="M4 20 Q12 14 20 20 Q12 26 4 20Z" fill="#FFD100" className="opacity-90"/>
      <path d="M36 20 Q28 14 20 20 Q28 26 36 20Z" fill="#FFD100" className="opacity-90"/>
      {/* Centro y Estrella */}
      <circle cx="20" cy="20" r="4" fill="#003087" stroke="#FFD100" strokeWidth="1"/>
      <circle cx="20" cy="20" r="1.5" fill="#FFD100"/>
      <polygon points="20,7 21.2,10.8 25,10.8 22,13 23.2,16.8 20,14.5 16.8,16.8 18,13 15,10.8 18.8,10.8" fill="#FFD100" className="opacity-70"/>
    </svg>
  );
}