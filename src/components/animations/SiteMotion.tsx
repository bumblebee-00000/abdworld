"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

const REVEAL_SELECTOR = "main h1, main h2, main h3, main h4, main p, main li";

function splitTextIntoLetters(element: HTMLElement) {
  if (element.dataset.letterReveal === "true") return;

  const accessibleText = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (!accessibleText) return;
  if (!element.hasAttribute("aria-label")) element.setAttribute("aria-label", accessibleText);

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    if (walker.currentNode.textContent?.trim()) textNodes.push(walker.currentNode as Text);
  }

  let letterIndex = 0;
  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    const segments = textNode.data.match(/\s+|[^\s]+/gu) ?? [];
    segments.forEach((segment) => {
      if (/^\s+$/u.test(segment)) {
        fragment.append(document.createTextNode(segment));
        return;
      }

      const word = document.createElement("span");
      word.className = "letter-reveal-word";
      Array.from(segment).forEach((character) => {
        const letter = document.createElement("span");
        letter.className = "letter-reveal-char";
        letter.setAttribute("aria-hidden", "true");
        letter.style.setProperty("--letter-delay", `${Math.min(letterIndex * 18, 920)}ms`);
        letter.textContent = character;
        word.append(letter);
        letterIndex += 1;
      });
      fragment.append(word);
    });
    textNode.replaceWith(fragment);
  });

  element.dataset.letterReveal = "true";
}

export default function SiteMotion({ children }: { children: ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setShowIntro(true));
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 160 : 1050;
    const timer = window.setTimeout(() => setShowIntro(false), duration);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    const revealVisibleElements = () => {
      document.querySelectorAll(".scroll-reveal-pending:not(.is-in-view)").forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top >= window.innerHeight || bounds.bottom <= 0) return;
        element.classList.add("is-in-view");
        element.classList.remove("scroll-reveal-pending");
        observer.unobserve(element);
      });
    };

    const observeText = (element: Element) => {
      if (!(element instanceof HTMLElement) || element.closest("[aria-hidden='true'], [data-no-scroll-reveal]")) return;
      if (element.classList.contains("scroll-reveal-text") || element.classList.contains("scroll-reveal-heading")) return;
      const isHeading = /^H[1-4]$/.test(element.tagName);
      const isShortCopy = element.tagName === "P" && (element.textContent?.trim().length ?? Infinity) <= 48;
      if (isHeading || isShortCopy) splitTextIntoLetters(element);
      element.classList.add(isHeading ? "scroll-reveal-heading" : "scroll-reveal-text");
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        element.classList.add("scroll-reveal-pending");
        window.requestAnimationFrame(() => element.classList.add("is-in-view"));
      } else {
        element.classList.add("scroll-reveal-pending");
        observer.observe(element);
      }
    };

    const scan = (root: ParentNode) => {
      if (root instanceof Element && root.matches(REVEAL_SELECTOR)) observeText(root);
      root.querySelectorAll(REVEAL_SELECTOR).forEach(observeText);
    };

    scan(document);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) scan(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", revealVisibleElements, { passive: true });
    window.addEventListener("resize", revealVisibleElements);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", revealVisibleElements);
      window.removeEventListener("resize", revealVisibleElements);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const selector = "button:not(:disabled), input[type='submit']:not(:disabled), [role='button']:not([aria-disabled='true']), a.inline-flex:not([aria-disabled='true'])";
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element)) return;
      const control = event.target.closest<HTMLElement>(selector);
      if (!control) return;

      const bounds = control.getBoundingClientRect();
      control.style.setProperty("--press-x", `${event.clientX - bounds.left}px`);
      control.style.setProperty("--press-y", `${event.clientY - bounds.top}px`);
      const baseShadow = getComputedStyle(control).boxShadow;
      const withGoldTint = (opacity: number) =>
        `inset 0 0 0 999px rgba(250, 204, 21, ${opacity})${baseShadow === "none" ? "" : `, ${baseShadow}`}`;
      control.animate([
        { boxShadow: withGoldTint(0) },
        { boxShadow: withGoldTint(0.34), offset: 0.28 },
        { boxShadow: withGoldTint(0) },
      ], { duration: 560, easing: "ease-out" });
      control.classList.add("button-ripple-target");
      control.classList.remove("button-ripple-active");
      void control.offsetWidth;
      control.classList.add("button-ripple-active");

      const finishRipple = (animationEvent: AnimationEvent) => {
        if (animationEvent.target !== control) return;
        if (animationEvent.pseudoElement === "::after") {
          control.classList.remove("button-ripple-active");
          control.removeEventListener("animationend", finishRipple);
        }
      };
      control.addEventListener("animationend", finishRipple);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, []);

  useEffect(() => {
    const selector = "button:not(:disabled), input[type='submit']:not(:disabled), [role='button']:not([aria-disabled='true']), a.inline-flex:not([aria-disabled='true'])";
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest<HTMLElement>(selector);
      if (!control || control.dataset.autoLoadingBound === "true") return;
      control.dataset.autoLoadingBound = "true";

      let loadingStarted = false;
      let updatedBeforeLoading = false;
      let maxWait: number | undefined;

      const clearLoading = () => {
        observer.disconnect();
        if (maxWait !== undefined) window.clearTimeout(maxWait);
        control.classList.remove("button-auto-loading");
        if (control.dataset.autoLoadingBusy === "true") {
          control.removeAttribute("aria-busy");
          delete control.dataset.autoLoadingBusy;
        }
      };

      const observer = new MutationObserver((records) => {
        const isOwnBusyUpdate = loadingStarted && records.every((record) =>
          record.target === control && record.attributeName === "aria-busy" && control.dataset.autoLoadingBusy === "true"
        );
        if (isOwnBusyUpdate) return;
        if (loadingStarted) clearLoading();
        else updatedBeforeLoading = true;
      });
      observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled", "aria-busy", "aria-expanded", "aria-pressed"],
      });

      window.setTimeout(() => {
        delete control.dataset.autoLoadingBound;
        if (
          updatedBeforeLoading ||
          !control.isConnected ||
          control.matches(":disabled, [aria-busy='true']") ||
          control.closest("form")?.querySelector("[aria-invalid='true'], [role='alert'], .text-red-500")
        ) {
          observer.disconnect();
          return;
        }

        loadingStarted = true;
        control.classList.add("button-auto-loading");
        control.dataset.autoLoadingBusy = "true";
        control.setAttribute("aria-busy", "true");
        maxWait = window.setTimeout(clearLoading, 15000);
      }, 240);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <>
      {children}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="site-intro-loader"
            role="status"
            aria-label="Loading ABD WORLD"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
          >
            <div className="site-intro-content">
              <motion.img
                className="site-intro-mark"
                src="/company-logo.png"
                alt=""
                initial={{ scale: 0.75, rotate: -18 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
              />
              <span className="site-intro-track" aria-hidden="true">
                <motion.span
                  className="site-intro-progress"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.85, ease: "easeInOut" }}
                />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}