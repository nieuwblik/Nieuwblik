import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { getLenis } from "@/components/SmoothScroll";
import logoSrc from "@/assets/logo.webp";

gsap.registerPlugin(CustomEase);

// Registered once at module scope — re-creating it per mount would throw away
// and rebuild the same curve on every navigation.
CustomEase.create("energy", "M0,0 C0.32,0.72 0,1 1,1");

export interface UnderlayNavItem {
  label: string;
  href: string;
}

interface UnderlayNavProps {
  links: UnderlayNavItem[];
  socials?: UnderlayNavItem[];
  quickLinks?: UnderlayNavItem[];
  logo?: ReactNode;
  /**
   * The page content. This component renders the <main> wrapper itself because
   * it has to animate it: main needs `position:relative; z-index:2;
   * overflow:clip` and gets tweened on x. Owning it here keeps the ref internal
   * — the alternative would be a document.querySelector for [data-main].
   */
  children: ReactNode;
}

const INK = "hsl(var(--sw-ink))";
const GREEN = "hsl(var(--sw-green))";
const MINT = "hsl(160, 70%, 60%)";
const ON_DARK = "#ffffff";

/**
 * Lets a dark-background section tell the fixed header to switch to its light
 * treatment while that section is under it.
 *
 * Registration is by ref, not a document query or a data-attribute scan: the
 * nav can't hold refs to sections in other files, and lifecycle-driven
 * registration means route changes clean themselves up — a re-scan would have
 * to guess when the new page had painted.
 */
type RegisterDarkSection = (el: Element) => () => void;
const DarkSectionContext = createContext<RegisterDarkSection | null>(null);

/**
 * Mark a section as dark-backgrounded, so the header inverts over it:
 *   const ref = useDarkNavSection<HTMLElement>();
 *   <section ref={ref}> …dark content… </section>
 */
export function useDarkNavSection<T extends Element = HTMLElement>(): RefObject<T> {
  const register = useContext(DarkSectionContext);
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !register) return;
    return register(el);
  }, [register]);
  return ref;
}

/** Internal routes go through the router; anything absolute opens in a new tab. */
function NavAnchor({
  item,
  className,
  children,
  onNavigate,
}: {
  item: UnderlayNavItem;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const external = /^https?:\/\//.test(item.href);
  if (external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={item.href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}

/**
 * Fixed underlay navigation — the menu sits behind the page on the right; the
 * page (plus a dark overlay) slides left to reveal it. Escape and a click on
 * the overlay close it.
 *
 * The timeline runs open→pause→close as ONE sequence rather than play/reverse,
 * so an interrupt mid-open resolves correctly (see `toggle`).
 */
export default function UnderlayNav({
  links,
  socials,
  quickLinks,
  logo,
  children,
}: UnderlayNavProps) {
  const { pathname } = useLocation();

  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const toggleTextRef = useRef<HTMLSpanElement>(null);
  const bar1Ref = useRef<HTMLSpanElement>(null);
  const bar2Ref = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const menuBorderRef = useRef<HTMLDivElement>(null);
  const headerScrimRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Imperative state — deliberately refs, not React state: the timeline reads
  // these on every toggle and a re-render would rebuild it mid-flight.
  const isOpenRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const enterEndTimeRef = useRef(0);
  const toggleRef = useRef<() => void>(() => {});
  const isMobileRef = useRef(false);

  // Header treatment for whatever is currently behind it. `isDarkBg` drives the
  // logo (plain React + a CSS transition); the toggle's colour stays owned by
  // GSAP via closedColorRef, so the menu timeline and this never fight over the
  // same property.
  const [isDarkBg, setIsDarkBg] = useState(false);
  const inkColorRef = useRef<string>(INK);
  const closedColorRef = useRef<string>(INK);
  const darkSectionsRef = useRef<Set<Element>>(new Set());
  const activeDarkRef = useRef<Set<Element>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useGSAP(
    () => {
      const toggleBtn = toggleBtnRef.current;
      const menuEl = menuRef.current;
      const mainEl = mainRef.current;
      const overlayEl = overlayRef.current;
      const header = headerRef.current;
      if (!toggleBtn || !menuEl || !mainEl || !overlayEl || !header) return;

      const toggleLabels = gsap.utils.toArray<HTMLElement>(toggleTextRef.current!.children);
      const toggleBars = [bar1Ref.current!, bar2Ref.current!];
      // Scoped to the container refs — never a document-wide query.
      const largeItems = gsap.utils.toArray<HTMLElement>(".un-reveal-l", listRef.current);
      const smallItems = gsap.utils.toArray<HTMLElement>(".un-reveal-s", bottomRef.current);
      const menuBorder = menuBorderRef.current;

      // Read the two toggle colours from the cascade so the tokens stay the
      // single source of truth: dark ink on the white page, white over the
      // green menu panel.
      // Resolved to rgb() by the cascade, so GSAP can tween them.
      const closedColor = getComputedStyle(toggleBtn).color;
      const openColor = getComputedStyle(menuEl).color;
      inkColorRef.current = closedColor;
      closedColorRef.current = closedColor;

      const getMenuOffset = () => -menuEl.offsetWidth;
      const syncIsMobile = () => {
        isMobileRef.current = !window.matchMedia("(min-width: 768px)").matches;
      };
      syncIsMobile();

      // Publish the real header height; .pt-header across every page offsets
      // against it (the old Navigation did the same).
      const syncHeaderHeight = () =>
        document.documentElement.style.setProperty(
          "--header-height",
          `${header.offsetHeight}px`
        );
      syncHeaderHeight();

      gsap.set(overlayEl, { visibility: "hidden", pointerEvents: "none" });
      gsap.set(mainEl, { x: 0 });
      gsap.set(toggleLabels, { yPercent: 0 });
      gsap.set(toggleBars, { y: 0, rotation: 0 });
      gsap.set(menuBorder, { scaleX: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "energy", easeReverse: "power2.inOut" },
      });
      tlRef.current = tl;

      tl.set(overlayEl, { visibility: "visible", pointerEvents: "auto" }, 0);

      tl.to([mainEl, overlayEl], { x: getMenuOffset, duration: 0.7 }, 0)
        // Mobile scrim: hidden by CSS on desktop, so this is a no-op there.
        .to(headerScrimRef.current, { autoAlpha: 0, duration: 0.3 }, 0)
        // On mobile the panel is 80vw, so it slides under the logo (which is
        // fixed and doesn't move). Fade it out there. Function-based so it is
        // re-read per open; on desktop it resolves to 1 = no-op.
        .to(
          logoRef.current,
          { autoAlpha: () => (isMobileRef.current ? 0 : 1), duration: 0.3 },
          0
        )
        .to(toggleLabels, { yPercent: -100, duration: 0.4 }, 0)
        .to(toggleBtn, { color: openColor, duration: 0.4 }, 0)
        .to(
          toggleBars[0],
          {
            y: "0.25em",
            rotation: 45,
            duration: 0.35,
            ease: "back.out(1.4)",
            easeReverse: "power3.out",
          },
          0.05
        )
        .to(
          toggleBars[1],
          {
            y: "-0.25em",
            rotation: -45,
            duration: 0.35,
            ease: "back.out(1.4)",
            easeReverse: "power3.out",
          },
          0.05
        )
        .fromTo(
          largeItems,
          { autoAlpha: 0, xPercent: 25 },
          { autoAlpha: 1, xPercent: 0, duration: 0.7, stagger: 0.05 },
          0
        )
        .fromTo(
          smallItems,
          { autoAlpha: 0, yPercent: 100 },
          { autoAlpha: 1, yPercent: 0, duration: 0.5, stagger: 0.03, ease: "power3.out" },
          0.3
        )
        .to(menuBorder, { scaleX: 1, duration: 0.5 }, "<");

      // Everything past this point is the close half of the same timeline. The
      // pause is what lets an interrupt mid-open be resolved by playing forward
      // instead of reversing (see toggle()).
      enterEndTimeRef.current = tl.duration();
      tl.addPause();

      tl.to([largeItems, smallItems], { autoAlpha: 0, duration: 0.3 }, "<")
        .to([mainEl, overlayEl], { x: 0, duration: 0.6 }, "<")
        // Function-based: the closed colour depends on the section under the
        // header, so it must be re-read on each invalidate() rather than baked
        // in when the timeline was built.
        .to(toggleBtn, { color: () => closedColorRef.current, duration: 0.25 }, "<+=0.1")
        .to(toggleLabels, { yPercent: 0, duration: 0.25, ease: "power3.in" }, "<")
        .to(toggleBars, { y: 0, rotation: 0, duration: 0.25, ease: "power3.in" }, "<")
        .to(headerScrimRef.current, { autoAlpha: 1, duration: 0.25 }, "<")
        .to(logoRef.current, { autoAlpha: 1, duration: 0.25 }, "<")
        .set(overlayEl, { visibility: "hidden", pointerEvents: "none" });

      // Body scroll lock. Lenis drives scrolling on desktop, so hiding overflow
      // alone would not stop it; html has scrollbar-gutter:stable so removing
      // the scrollbar can't shift the layout.
      const lockScroll = (lock: boolean) => {
        const lenis = getLenis();
        if (lock) {
          lenis?.stop();
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
          lenis?.start();
        }
      };

      const toggle = () => {
        const isOpen = !isOpenRef.current;
        isOpenRef.current = isOpen;
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        toggleBtn.setAttribute("aria-label", isOpen ? "close menu" : "open menu");
        lockScroll(isOpen);

        if (isOpen) {
          tl.invalidate();
          if (tl.time() >= enterEndTimeRef.current) tl.timeScale(1).restart();
          else tl.timeScale(1).play();
        } else {
          if (tl.time() < enterEndTimeRef.current) tl.timeScale(1).reverse();
          else tl.timeScale(1).play();
        }
      };
      toggleRef.current = toggle;

      const onOverlayClick = () => {
        if (isOpenRef.current) toggle();
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpenRef.current) {
          toggle();
          toggleBtn.focus();
        }
      };

      let resizeTimer: number | undefined;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          syncHeaderHeight();
          syncIsMobile();
          if (isOpenRef.current) {
            gsap.set([mainEl, overlayEl], { x: getMenuOffset() });
            // Crossing the breakpoint while open: the logo only hides on mobile.
            gsap.set(logoRef.current, { autoAlpha: isMobileRef.current ? 0 : 1 });
          } else {
            tl.invalidate();
          }
        }, 150);
      };

      toggleBtn.addEventListener("click", toggle);
      overlayEl.addEventListener("click", onOverlayClick);
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("resize", onResize);

      return () => {
        window.clearTimeout(resizeTimer);
        toggleBtn.removeEventListener("click", toggle);
        overlayEl.removeEventListener("click", onOverlayClick);
        document.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("resize", onResize);
        tl.kill();
        tlRef.current = null;
        // Never leave the page unscrollable if we unmount while open.
        document.body.style.overflow = "";
        getLenis()?.start();
      };
    },
    { scope: rootRef }
  );

  // ── Header contrast ────────────────────────────────────────────────────
  // A 1px sensor band across the header's midline. Sections register by ref;
  // whenever one crosses the band the header flips to its light treatment.
  // IntersectionObserver does the work natively — nothing runs per scroll frame.
  const applyTheme = useCallback((dark: boolean) => {
    setIsDarkBg(dark);
    closedColorRef.current = dark ? ON_DARK : inkColorRef.current;
    const btn = toggleBtnRef.current;
    // While the menu is open the timeline owns this colour — don't fight it.
    // (Scroll is locked then anyway, so the theme can't change mid-open.)
    if (btn && !isOpenRef.current) {
      gsap.to(btn, { color: closedColorRef.current, duration: 0.25, overwrite: "auto" });
    }
  }, []);

  useEffect(() => {
    const buildObserver = () => {
      observerRef.current?.disconnect();
      const header = headerRef.current;
      if (!header) return;

      // Mobile carries a blurred scrim behind the header instead, so the
      // backdrop is always light there — inverting would put a white logo on a
      // light scrim. Keep it on the ink treatment and skip the observer.
      if (!window.matchMedia("(min-width: 768px)").matches) {
        activeDarkRef.current.clear();
        applyTheme(false);
        return;
      }

      const sensorY = header.offsetHeight / 2;
      const bottom = Math.max(0, window.innerHeight - sensorY - 1);
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) activeDarkRef.current.add(e.target);
            else activeDarkRef.current.delete(e.target);
          }
          applyTheme(activeDarkRef.current.size > 0);
        },
        { rootMargin: `-${sensorY}px 0px -${bottom}px 0px`, threshold: 0 }
      );
      darkSectionsRef.current.forEach((el) => io.observe(el));
      observerRef.current = io;
    };

    buildObserver();

    // The band is derived from the header height and viewport height, so both
    // have to be re-derived when either changes.
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        activeDarkRef.current.clear();
        buildObserver();
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [applyTheme]);

  const registerDarkSection = useCallback<RegisterDarkSection>((el) => {
    darkSectionsRef.current.add(el);
    observerRef.current?.observe(el);
    return () => {
      darkSectionsRef.current.delete(el);
      activeDarkRef.current.delete(el);
      observerRef.current?.unobserve(el);
      applyTheme(activeDarkRef.current.size > 0);
    };
  }, [applyTheme]);

  // Close on navigation, otherwise the menu stays open over the new page.
  const closeIfOpen = () => {
    if (isOpenRef.current) toggleRef.current();
  };

  const hasBottom = Boolean(socials?.length || quickLinks?.length);

  return (
    <div ref={rootRef}>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-[100]"
        style={{ color: INK }}
      >
        {/* Mobile-only blurred scrim: on a narrow screen the header sits right
            on top of the content, so it needs its own backdrop to stay legible.
            Fades out with the menu (see the timeline) — otherwise it would wash
            a light haze over the green panel. */}
        <div
          ref={headerScrimRef}
          aria-hidden="true"
          className="absolute inset-0 md:hidden pointer-events-none"
          style={{
            background: "hsl(var(--background) / 0.72)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid hsl(var(--sw-rule) / 0.08)",
          }}
        />
        <div className="relative flex items-center justify-between p-[1.25em] md:p-[2.5em]">
          <Link
            ref={logoRef}
            to="/"
            aria-label="Nieuwblik — home"
            className="flex items-center justify-center w-[5em] md:w-[6.875em]"
            onClick={closeIfOpen}
          >
            {logo ?? (
              <img
                src={logoSrc}
                alt="Nieuwblik"
                className="w-full h-auto"
                draggable={false}
                // Raster logo: brightness(0) forces it black, +invert(1) forces
                // it white over the dark sections.
                style={{
                  filter: isDarkBg ? "brightness(0) invert(1)" : "brightness(0)",
                  transition: "filter 0.25s ease",
                }}
              />
            )}
          </Link>

          <button
            ref={toggleBtnRef}
            type="button"
            aria-expanded="false"
            aria-label="open menu"
            className="flex items-center justify-center gap-[0.75em] -m-[1em] p-[1em] bg-transparent border-0 font-epilogue"
          >
            <span
              ref={toggleTextRef}
              className="flex flex-none flex-col items-end justify-start h-[1.25em] md:h-[1.5em] overflow-hidden"
            >
              <span className="text-[1em] md:text-[1.25em] leading-[1.25em] md:leading-[1.5em]">
                Menu
              </span>
              <span className="text-[1em] md:text-[1.25em] leading-[1.25em] md:leading-[1.5em]">
                Sluit
              </span>
            </span>
            <span className="flex flex-none flex-col items-center justify-center w-[1.5em] gap-[0.375em] -mb-[0.3em]">
              <span ref={bar1Ref} className="w-full h-[0.125em] flex-none bg-current" />
              <span ref={bar2Ref} className="w-full h-[0.125em] flex-none bg-current" />
            </span>
          </button>
        </div>
      </header>

      {/* The menu itself — an underlay: it sits at z-1, behind main (z-2). */}
      <nav
        ref={menuRef}
        className="fixed top-0 bottom-0 right-0 z-[1] w-[var(--menu-width)]"
        style={{ background: GREEN, color: "#fff" }}
      >
        <div className="flex flex-col justify-between items-stretch gap-8 w-full h-full overflow-auto pt-[5em] px-[1.25em] pb-[1.25em] md:pt-[7.5em] md:px-[2em] md:pb-[2em]">
          <ul ref={listRef} className="flex flex-col w-full list-none p-0 m-0">
            {links.map((item) => {
              const active = item.href === pathname;
              return (
                <li key={item.href} className="un-reveal-l">
                  <NavAnchor
                    item={item}
                    onNavigate={closeIfOpen}
                    className="block w-full rounded-[0.25em] px-[1em] py-[0.75em] transition-colors"
                  >
                    {/* The reference's -0.04em/0.9 was tuned for Haffer XH.
                        Epilogue 700 is a wider face: at that tracking the
                        letters collide, and 0.9 leaves the line box shorter
                        than the glyphs. */}
                    <span
                      className="font-epilogue font-bold text-[2em] md:text-[3.25em] leading-[1.05] tracking-[-0.01em] block"
                      style={active ? { color: MINT } : undefined}
                    >
                      {item.label}
                    </span>
                  </NavAnchor>
                </li>
              );
            })}
          </ul>

          {hasBottom && (
            <div
              ref={bottomRef}
              className="relative flex flex-col md:flex-row items-start justify-start gap-8 md:gap-0 w-full pt-[1.5em] px-[1em] md:px-0"
            >
              {socials?.length ? (
                <div className="flex flex-1 flex-col items-start gap-[1em]">
                  <div className="un-reveal-s">
                    <span className="text-[1em] leading-[1.1] opacity-50">Socials</span>
                  </div>
                  <ul className="flex flex-col w-full list-none p-0 m-0 gap-[0.75em]">
                    {socials.map((item) => (
                      <li key={item.href} className="un-reveal-s">
                        <NavAnchor
                          item={item}
                          onNavigate={closeIfOpen}
                          className="text-[1em] leading-[1.1] transition-opacity hover:opacity-70"
                        >
                          {item.label}
                        </NavAnchor>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {quickLinks?.length ? (
                <div className="flex flex-1 flex-col items-start gap-[1em]">
                  <div className="un-reveal-s">
                    <span className="text-[1em] leading-[1.1] opacity-50">Snelle links</span>
                  </div>
                  <ul className="flex flex-col w-full list-none p-0 m-0 gap-[0.75em]">
                    {quickLinks.map((item) => (
                      <li key={item.href} className="un-reveal-s">
                        <NavAnchor
                          item={item}
                          onNavigate={closeIfOpen}
                          className="text-[1em] leading-[1.1] transition-opacity hover:opacity-70"
                        >
                          {item.label}
                        </NavAnchor>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div
                ref={menuBorderRef}
                className="absolute inset-x-0 top-0 h-px w-full origin-left opacity-15 bg-current"
              />
            </div>
          )}
        </div>
      </nav>

      {/* Slides left in lockstep with main. Purely a hit area: no tint, and no
          frame/corner masks — those framed the page but fought the layout. */}
      <div
        ref={overlayRef}
        className="fixed inset-y-0 left-0 -right-px z-[100] cursor-pointer invisible pointer-events-none"
        style={{ overflow: "clip" }}
      />

      {/* The page. Owned here because the timeline tweens its x. */}
      <main ref={mainRef} className="relative z-[2]" style={{ overflow: "clip" }}>
        <DarkSectionContext.Provider value={registerDarkSection}>
          {children}
        </DarkSectionContext.Provider>
      </main>
    </div>
  );
}
