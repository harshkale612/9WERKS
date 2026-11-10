"use client";

/**
 * Site header.
 *  - Transparent over the first screen, settles into a blurred obsidian bar once scrolled.
 *  - Hides while scrolling down (after the first screen), returns on scroll up.
 *  - Below `lg`: logo, a compact Book button and the menu toggle → full-screen menu
 *    (role="dialog", focus trapped, Esc closes, page scroll locked).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useLenis } from "@/components/motion/MotionProvider";
import { primaryNav } from "@/content/navigation";
import { contact } from "@/content/site";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The menu is open only for the path it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const goingDown = y > lastY.current + 4;
        const goingUp = y < lastY.current - 4;
        if (goingDown && y > window.innerHeight * 0.6) setHidden(true);
        else if (goingUp || y < 120) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      lenis.stop();
      html.style.overflow = "hidden";
    } else {
      lenis.start();
      html.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
    };
  }, [open, lenis]);

  const close = useCallback(() => {
    setOpenPath(null);
    toggleRef.current?.focus();
  }, []);

  const onBooking = pathname.startsWith(routes.booking);

  return (
    <>
      <header
        className={cn(
          "theme-studio fixed inset-x-0 top-0 z-50 !bg-transparent transition-transform duration-500 ease-out-expo",
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || open ? "border-line bg-ink-950/80 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent"
          )}
        />
        <div className="container-x relative flex h-[4.5rem] items-center justify-between gap-6 lg:h-[5.25rem]">
          <Link href={routes.home} className="relative z-10 block w-[7.25rem] shrink-0 sm:w-[8.5rem] lg:w-[9.75rem]" aria-label="9WERKS — home">
            <Logo priority sizes="(min-width: 1024px) 156px, 136px" alt="" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group/nav relative inline-flex min-h-11 items-center px-4 text-[0.75rem] font-[560] uppercase tracking-[0.14em] transition-colors duration-300",
                        active ? "text-fg" : "text-fg-muted hover:text-fg"
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-4 bottom-2 h-px origin-left bg-accent transition-transform duration-500 ease-out-expo",
                          active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <a
              href={contact.phone.href}
              className="label hidden min-h-11 items-center gap-2 px-2 text-fg-muted transition-colors hover:text-fg xl:inline-flex"
            >
              <Phone aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              <span className="tabular">{contact.phone.display}</span>
            </a>
            {!onBooking && (
              <ButtonLink href={routes.booking} size="md" noArrow className="!min-h-10 !px-4 sm:!min-h-11 sm:!px-5">
                <span className="sm:hidden">Book</span>
                <span className="hidden sm:inline">Book a service</span>
              </ButtonLink>
            )}
            <button
              ref={toggleRef}
              type="button"
              className="relative -mr-2 inline-flex size-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpenPath(open ? null : pathname)}
            >
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span className={cn("absolute left-0 top-0 h-px w-6 bg-fg transition-transform duration-500 ease-out-expo", open && "translate-y-[5.5px] rotate-45")} />
                <span className={cn("absolute bottom-0 right-0 h-px bg-fg transition-all duration-500 ease-out-expo", open ? "w-6 -translate-y-[5.5px] -rotate-45" : "w-4")} />
              </span>
            </button>
          </div>
        </div>
        <RouteProgress />
      </header>

      <AnimatePresence>{open && <MobileMenu key="menu" pathname={pathname} onClose={close} />}</AnimatePresence>
    </>
  );
}

/**
 * Thin bronze line that sweeps across the header bottom while a route loads —
 * starts on internal link clicks, completes when the new pathname renders.
 */
function RouteProgress() {
  const pathname = usePathname();
  // Path the user navigated away from; null when idle.
  const [from, setFrom] = useState<string | null>(null);
  const state: "idle" | "loading" | "done" = from === null ? "idle" : from === pathname ? "loading" : "done";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      setFrom(window.location.pathname);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Once the new route has rendered, let the "done" sweep finish, then reset.
  useEffect(() => {
    if (state !== "done") return;
    const id = window.setTimeout(() => setFrom(null), 700);
    return () => window.clearTimeout(id);
  }, [state]);

  return (
    <m.span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-bronze"
      initial={false}
      animate={
        state === "loading"
          ? { scaleX: 0.72, opacity: 1, transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1] } }
          : state === "done"
            ? { scaleX: 1, opacity: 0, transition: { scaleX: { duration: 0.35 }, opacity: { duration: 0.35, delay: 0.3 } } }
            : { scaleX: 0, opacity: 0, transition: { duration: 0 } }
      }
    />
  );
}
