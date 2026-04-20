import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const INSTAGRAM_URL =
  "https://www.instagram.com/crookibakebar?igsh=MWJjcnJoazB5ZmxkaQ==";
const TIKTOK_URL =
  "https://www.tiktok.com/@crookibakebar?_r=1&_t=ZS-95JY49t8jcO";
const WHATSAPP_URL = "https://wa.me/573027190084";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 8.2a7 7 0 0 1-4.1-1.3v7.8a6 6 0 1 1-6-6v3.2a2.8 2.8 0 1 0 2 2.7V2h3a4.1 4.1 0 0 0 5.1 4.1V8.2Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.1 17.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.5 8.5 0 0 1-2.5-1.5 9.2 9.2 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5a2 2 0 0 0 .3-.5.5.5 0 0 0 0-.5l-.9-2.3c-.3-.7-.5-.6-.7-.6h-.6a1.1 1.1 0 0 0-.8.4 3.3 3.3 0 0 0-1 2.5c0 1.5 1.1 2.9 1.2 3.1s2.1 3.3 5.1 4.6c1.7.8 2.4.8 3.3.7a3 3 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.4Zm-5 6.5a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4a9.9 9.9 0 1 1 8.4 4.6Zm8.4-18.3a11.8 11.8 0 0 0-18.5 14.2l-1.3 4.7 4.8-1.3a11.8 11.8 0 0 0 5.6 1.4 11.8 11.8 0 0 0 9.4-18.8Z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("nav");
  const tc = useTranslations("contact");

  return (
    <footer style={{ backgroundColor: "#8b0031" }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-black tracking-tight mb-3">CROOKI</div>
            <p className="text-red-200 text-sm leading-relaxed">
              Galletas artesanales hechas con los mejores ingredientes y mucho amor.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-red-200">
              {t("menu")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-white hover:text-red-200 transition-colors text-sm">
                {t("home")}
              </Link>
              <Link href="/menu" className="text-white hover:text-red-200 transition-colors text-sm">
                {t("menu")}
              </Link>
              <Link href="/merch" className="text-white hover:text-red-200 transition-colors text-sm">
                {t("merch")}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-red-200">
              Social
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tc("instagram")}
                className="flex items-center gap-3 text-sm text-white hover:text-red-200 transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
                @crookibakebar
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tc("tiktok")}
                className="flex items-center gap-3 text-sm text-white hover:text-red-200 transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
                @crookibakebar
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tc("whatsapp")}
                className="flex items-center gap-3 text-sm text-white hover:text-red-200 transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                +57 302 719 0084
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-red-700 mt-8 pt-6 text-center text-red-300 text-xs">
          © {new Date().getFullYear()} Crooki. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
