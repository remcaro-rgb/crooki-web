"use client";

import { useTranslations } from "next-intl";

const WHATSAPP_URL = "https://wa.me/573027190084";

export default function WhatsAppButton() {
  const t = useTranslations("contact");

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
    >
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.1 17.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.5 8.5 0 0 1-2.5-1.5 9.2 9.2 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5a2 2 0 0 0 .3-.5.5.5 0 0 0 0-.5l-.9-2.3c-.3-.7-.5-.6-.7-.6h-.6a1.1 1.1 0 0 0-.8.4 3.3 3.3 0 0 0-1 2.5c0 1.5 1.1 2.9 1.2 3.1s2.1 3.3 5.1 4.6c1.7.8 2.4.8 3.3.7a3 3 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.4Zm-5 6.5a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4a9.9 9.9 0 1 1 8.4 4.6Zm8.4-18.3a11.8 11.8 0 0 0-18.5 14.2l-1.3 4.7 4.8-1.3a11.8 11.8 0 0 0 5.6 1.4 11.8 11.8 0 0 0 9.4-18.8Z" />
      </svg>
    </a>
  );
}
