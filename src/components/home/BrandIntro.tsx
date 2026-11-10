/**
 * 01 — Brand introduction. The ORIGINAL logo is revealed by a light-sweep
 * wipe over studio black, then the curtain lifts onto the hero.
 *
 * Robustness (see globals.css → "brand intro"):
 *  - An inline script, parsed before the overlay, enables it only on the
 *    first home visit of the session and only when motion is allowed.
 *  - The whole sequence is pure CSS (≈2.6 s), so it finishes even if
 *    JavaScript fails later; the page beneath is fully rendered from the start.
 *  - The client controller lets any key / click / the Skip button end it early.
 */
import { Logo } from "@/components/brand/Logo";
import { BrandIntroController } from "./hero/BrandIntroController";

const boot = `(function(d){try{var m=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!m&&!sessionStorage.getItem('9w-intro')){sessionStorage.setItem('9w-intro','1');d.classList.add('intro-play')}}catch(e){}})(document.documentElement)`;

export function BrandIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      <div className="brand-intro" aria-hidden="true">
        <div className="w-[min(72vw,30rem)]">
          <div className="brand-intro__logo">
            <Logo priority sizes="(min-width: 640px) 480px, 72vw" alt="" />
          </div>
          <div className="brand-intro__rule mt-8 h-px bg-bronze" />
        </div>
      </div>
      <BrandIntroController />
    </>
  );
}
