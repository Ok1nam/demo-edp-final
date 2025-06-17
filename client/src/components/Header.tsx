import * as React from "react"

import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "/logo-edp.png"; // <- Import explicite du logo

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const event = new CustomEvent("toggleNavigation", { detail: !isMenuOpen });
    window.dispatchEvent(event);
  };

  return (
    <header className="header-gradient text-white p-4 md:p-8 min-h-[120px] flex items-center justify-between relative">
      <div className="flex items-center gap-4 max-w-[70%]">
<img 
  src={`${import.meta.env.BASE_URL}logo-edp.webp`} 
  alt="Logo EDP" 
  className="w-12 h-12 md:w-16 md:h-16 object-contain flex-shrink-0"
/>




        <div className="text-sm md:text-base leading-relaxed">
          Proposition d'une démarche méthodologique d'accompagnement par l'expert-comptable dans la création et le pilotage d'une école de production
        </div>
      </div>

      <button
        className="burger w-8 h-6 flex flex-col justify-between cursor-pointer z-50 transition-all duration-300"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>
    </header>
  );
}
