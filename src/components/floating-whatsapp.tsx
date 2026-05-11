"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const WHATSAPP_LINK =
  "https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20tertarik%20untuk%20berwisata%20ke%20Turki";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className={`fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-uber-sm transition-all duration-300 hover:opacity-90 hover:scale-110 active:shadow-uber-pressed ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
