import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Wheat } from "lucide-react";

const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "ABD WORLD";
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "contact@abdworld.in";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 99999 99999";
const PHONE_TEL = PHONE_DISPLAY.replace(/[\s-]/g, "");
const WHATSAPP_URL = `https://wa.me/${
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999"
}?text=${encodeURIComponent("Hello! I would like to enquire about your wholesale rice.")}`;
const ADDRESS = "Aminpur Bazar, Boalghata Road, Paltadanga, West Bengal 743423";
const BUSINESS_HOURS = "Mon – Sat: 9:00 AM – 7:00 PM";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Rice Collection", href: "/products" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Why Choose Us", href: "/#why-us" },
  { label: "Contact", href: "/contact" },
];

const CUSTOMER_LINKS = [
  { label: "Bulk Order", href: "/wholesale", key: "bulk-order" },
  { label: "Become a Distributor", href: "/wholesale#distributor", key: "distributor" },
  { label: "Browse All Rice", href: "/products", key: "browse-rice" },
  { label: "Enquire Now", href: "/contact", key: "enquire-now" },
  { label: "FAQs", href: "/contact#faq", key: "faqs" },
  { label: "Order via WhatsApp", href: "/contact", key: "whatsapp-order" },
];

interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

const CONTACT_ITEMS: ContactItem[] = [
  { icon: Phone, label: "Call Us", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with our sales team", href: WHATSAPP_URL, external: true },
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: MapPin, label: "Address", value: ADDRESS },
];

const SOCIALS: Array<{ icon: LucideIcon; label: string; href: string; external: boolean }> = [
  { icon: MessageCircle, label: "WhatsApp", href: WHATSAPP_URL, external: true },
  { icon: Mail, label: "Email", href: `mailto:${EMAIL}`, external: false },
  { icon: Phone, label: "Call", href: `tel:${PHONE_TEL}`, external: false },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="premium-gradient relative overflow-hidden text-cream-100">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-[radial-gradient(rgba(250,204,21,0.35)_1px,transparent_1px)] opacity-50 [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden="true" className="relative h-px w-full bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="mb-10 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/60 ring-1 ring-gold-500/40">
            <Wheat size={18} className="text-gold-400" />
          </span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-8">
          <div>
            <Link href="/" className="group flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-gold-300 shadow-md shadow-black/20 transition-colors group-hover:bg-emerald-700">
                <Wheat size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-xl font-bold tracking-tight text-white">{BUSINESS_NAME}</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400">
                  Wholesale Excellence
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-100/65">
              A premium rice wholesaler supplying hand-picked Basmati, non-Basmati and specialty grains to
              retailers, restaurants and businesses across India and worldwide — with consistent quality,
              honest grading and reliable bulk delivery.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.external ? "_blank" : undefined}
                    rel={social.external ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-300"
                  >
                    <social.icon size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-cream-100/70 transition-all duration-200 hover:text-gold-300"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rotate-45 bg-gold-500/60 transition-transform duration-300 group-hover:scale-125 group-hover:bg-gold-400"
                    />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer links">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Customer Care</h3>
            <ul className="mt-5 space-y-3">
              {CUSTOMER_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-cream-100/70 transition-all duration-200 hover:text-gold-300"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rotate-45 bg-gold-500/60 transition-transform duration-300 group-hover:scale-125 group-hover:bg-gold-400"
                    />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Get in Touch</h3>
            <ul className="mt-5 space-y-4">
              {CONTACT_ITEMS.map((item) => {
                const inner = (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gold-400">
                      <item.icon size={15} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-cream-100/45">
                        {item.label}
                      </span>
                      <span className="block truncate text-sm font-medium text-cream-100/90">{item.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={item.label} className="flex items-center gap-3">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 transition-colors hover:text-gold-300"
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-cream-100/70">
              <Clock size={14} aria-hidden="true" className="shrink-0 text-gold-400" />
              {BUSINESS_HOURS}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream-100/55 sm:flex-row">
          <p>
            © {year} {BUSINESS_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-gold-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gold-300">
              Terms &amp; Conditions
            </Link>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Wheat size={11} aria-hidden="true" className="text-gold-500" />
              Pure. Honest. Quality.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;