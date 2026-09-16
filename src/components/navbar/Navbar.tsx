"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Wheat,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";

const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "ABD WORLD";
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "abdworldinfo@gmail.com";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 99999 99999";
const PHONE_TEL = PHONE_DISPLAY.replace(/[\s-]/g, "");
const WHATSAPP_URL = `https://wa.me/${
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999"
}?text=${encodeURIComponent("Hello! I would like to enquire about your wholesale rice.")}`;
const LOGO_URL = "/company-logo.png";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Rice Collection",
    href: "/products",
    children: [
      { label: "Basmati Rice", href: "/products?category=Basmati" },
      { label: "Non-Basmati Rice", href: "/products?category=Non-Basmati" },
      { label: "Specialty Rice", href: "/products?category=Specialty" },
    ],
  },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Contact", href: "/contact" },
];

const DRAWER_STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
};

const DRAWER_ITEM: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const isActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen || searchOpen || pathname !== "/";

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    router.push(`/products${term ? `?q=${encodeURIComponent(term)}` : ""}`);
    setSearchOpen(false);
    setQuery("");
  };

  const iconButton = (isSolid: boolean) =>
    cx(
      "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70",
      isSolid ? "text-emerald-800 hover:bg-emerald-100" : "text-cream-100 hover:bg-white/10",
    );

  const desktopLinkClasses = (item: NavItem) =>
    cx(
      "relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
      isActive(item)
        ? solid
          ? "text-highlight-600"
          : "text-highlight-300"
        : solid
          ? "text-emerald-950 hover:text-emerald-800"
          : "text-cream-100/90 hover:text-white",
    );

  const drawerLinkClasses = (item: NavItem) =>
    cx(
      "relative flex w-full items-center justify-between rounded-xl px-4 py-3 font-heading text-lg font-semibold transition-colors",
      isActive(item) ? "text-gold-400" : "text-emerald-950 hover:text-emerald-800",
    );

  return (
    <header
      className={cx(
        "top-0 z-50 w-full transition-all duration-300",
        solid
          ? "sticky border-b border-white/60 bg-white/90 shadow-lg shadow-emerald-950/5 backdrop-blur-xl"
          : "absolute bg-transparent",
      )}
    >
      <AnimatePresence initial={false}>
        {!solid && (
          <motion.div
            key="top-strip"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-emerald-950/95 text-cream-100"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
              <p className="inline-flex items-center gap-2">
                <Wheat size={13} aria-hidden="true" className="text-gold-400" />
                <span className="font-semibold text-gold-400/90">{BUSINESS_NAME}</span>
                <span className="hidden text-cream-100/80 sm:inline">Premium wholesale rice supplier</span>
              </p>
              <div className="flex items-center gap-5">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="hidden items-center gap-1.5 text-cream-100/80 transition-colors hover:text-gold-400 sm:inline-flex"
                >
                  <Phone size={12} aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="hidden items-center gap-1.5 text-cream-100/80 transition-colors hover:text-gold-400 md:inline-flex"
                >
                  <Mail size={12} aria-hidden="true" />
                  {EMAIL}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${BUSINESS_NAME} — Home`}>
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-emerald-900/10 bg-white/90 shadow-md shadow-emerald-900/10 ring-2 ring-gold-300/60 transition-transform duration-200 group-hover:scale-[1.02]">
            <img src={LOGO_URL} alt={`${BUSINESS_NAME} logo`} className="h-9 w-9 object-contain" />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cx(
                "font-heading text-lg font-black tracking-[0.08em] transition-colors duration-300 sm:text-xl",
                solid ? "text-emerald-950" : "text-white",
              )}
            >
              {BUSINESS_NAME}
            </span>
            <span
              className={cx(
                "mt-0.5 text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors duration-300",
                solid ? "text-gold-700" : "text-gold-300",
              )}
            >
              Wholesale Excellence
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                aria-expanded={item.children ? openDropdown === item.href : undefined}
                className={desktopLinkClasses(item)}
              >
                {item.label}
                {item.children ? (
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={cx(
                      "transition-transform duration-300",
                      openDropdown === item.href && "rotate-180",
                    )}
                  />
                ) : null}
                {isActive(item) ? (
                  <motion.span
                    layoutId="nav-underline"
                    aria-hidden="true"
                    className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full gold-gradient"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </Link>
              {item.children ? (
                <AnimatePresence>
                  {openDropdown === item.href ? (
                    <motion.div
                      key="nav-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.98, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                      exit={{ opacity: 0, y: 6, scale: 0.98, x: "-50%" }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-1/2 top-full z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-white/60 bg-white/95 p-2 shadow-xl shadow-emerald-950/10 backdrop-blur-xl"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-emerald-950/80 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <Wheat size={13} aria-hidden="true" className="shrink-0 text-gold-600" />
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            className={iconButton(solid)}
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className={iconButton(solid)}
          >
            <MessageCircle size={18} aria-hidden="true" />
          </a>
          <Button
            href="/contact"
            variant="secondary"
            size="sm"
            rightIcon={<ArrowRight size={14} aria-hidden="true" />}
            className="hidden md:inline-flex"
          >
            Enquire Now
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={cx(iconButton(solid), "lg:hidden")}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen ? (
          <motion.div
            key="search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-emerald-950/95"
          >
            <form role="search" onSubmit={submitSearch} className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="relative">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search rice varieties, origins, pack sizes..."
                  aria-label="Search rice varieties"
                  className="w-full rounded-full border border-white/15 bg-white/10 py-3 pl-12 pr-28 text-sm text-cream-100 placeholder:text-cream-100/40 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full gold-gradient px-4 py-2 text-xs font-semibold text-emerald-950 transition hover:brightness-105"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {typeof window !== "undefined" &&
        createPortal(
        <AnimatePresence>
          {menuOpen ? (
            <>
              <motion.div
                key="drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
                className="fixed inset-0 z-[60] bg-emerald-950/60 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                key="mobile-drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                aria-label="Mobile navigation"
                className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-emerald-950 text-cream-100 shadow-2xl lg:hidden"
              >
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-gold-300">
                      <Wheat size={18} aria-hidden="true" />
                    </span>
                    <span className="font-heading text-lg font-bold text-white">{BUSINESS_NAME}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-cream-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3">
                  <motion.ul variants={DRAWER_STAGGER} initial="hidden" animate="show" className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <motion.li key={item.href} variants={DRAWER_ITEM}>
                        {item.children ? (
                          <div className="overflow-hidden rounded-xl">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenSection(openSection === item.href ? null : item.href)
                              }
                              aria-expanded={openSection === item.href}
                              className={drawerLinkClasses(item)}
                            >
                              {item.label}
                              <ChevronDown
                                size={18}
                                aria-hidden="true"
                                className={cx(
                                  "shrink-0 transition-transform duration-300",
                                  openSection === item.href && "rotate-180",
                                )}
                              />
                            </button>
                            <AnimatePresence>
                              {openSection === item.href ? (
                                <motion.ul
                                  key="drawer-submenu"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.28, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  {item.children.map((child) => (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-cream-100/75 transition-colors hover:bg-white/5 hover:text-white"
                                      >
                                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold-400" />
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link href={item.href} onClick={() => setMenuOpen(false)} className={drawerLinkClasses(item)}>
                            {isActive(item) ? (
                              <span
                                aria-hidden="true"
                                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full gold-gradient"
                              />
                            ) : null}
                            {item.label}
                          </Link>
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <div className="space-y-3 border-t border-white/10 p-4">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    WhatsApp Us
                  </a>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-white/5"
                  >
                    <Phone size={15} aria-hidden="true" />
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  );
}

export default Navbar;