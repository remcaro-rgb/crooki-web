import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail } from "lucide-react";

export default function Footer() {
  const t = useTranslations("nav");

  return (
    <footer style={{ backgroundColor: "#8b0031" }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="text-3xl font-black tracking-tight mb-3">CROOKI</div>
            <p className="text-red-200 text-sm leading-relaxed">
              Galletas artesanales hechas con los mejores ingredientes y mucho amor.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-red-200">
              Navegación
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-white hover:text-red-200 transition-colors text-sm">
                {t("home")}
              </Link>
              <Link href="/menu" className="text-white hover:text-red-200 transition-colors text-sm">
                {t("menu")}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-red-200">
              Contacto
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/crooki"
                className="flex items-center gap-2 text-sm text-white hover:text-red-200 transition-colors"
              >
                <span className="w-4 h-4 inline-block text-center font-bold text-xs">📸</span>
                @crooki
              </a>
              <a
                href="mailto:hola@crooki.com"
                className="flex items-center gap-2 text-sm text-white hover:text-red-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                hola@crooki.com
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
