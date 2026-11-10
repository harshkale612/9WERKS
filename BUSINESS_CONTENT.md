# Business Content — 9WERKS

Content inventory of the previous website (audited 3–4 Nov 2026) and the verified facts used by the new site. All live copy is stored in `src/content/*`; nothing on the site is hard-coded outside it.

A read-only snapshot of the old site (HTML, CSS, JS) is kept in `docs/reference/legacy-site/` for traceability. The new site shares no code with it.

## 1. Verified business facts

| Fact | Value used | Source | Status |
|---|---|---|---|
| Name | 9WERKS | Official site, logo | ✅ |
| Tagline | A crew for your luxe ride | Logo artwork, official site | ✅ |
| Category | Exotic, supercar & sports car specialists | Official site | ✅ |
| Address | S No 259/3, Shatik Park, behind Seasons Road, Shambhu Vihar Society, Sanewadi, Aundh, Pune, Maharashtra **411007** | Official site, brief | ⚠️ See flag 1 |
| Coordinates | 18.5544° N, 73.8019° E | Official structured data / map embed | ✅ |
| Phone | +91 70831 99986 (`tel:+917083199986`) | Official site, brief | ✅ |
| WhatsApp | wa.me/917083199986 | Official site | ✅ |
| Email | 9werks9@gmail.com | Official site, brief | ✅ |
| Hours | Mon–Fri 9:00 AM–9:00 PM · Sat–Sun 9:00 AM–12:00 PM (Asia/Kolkata) | Official site, brief | ✅ |
| Instagram | @9werksofficial · @9werksdetailzstudio (detailing) | Official site | ✅ |
| Google listing | maps.google.com/?cid=1339525493130839216 | Official site | ✅ |
| Rating | **4.9 / 5 from 196 Google reviews**, as of November 2026 | Read from the official Google Maps embed on 4 Nov 2026 | ✅ Dated snapshot (old site still says 191) |
| Statistics | 35 years · 19 expert technicians · 1,500+ satisfied clients · 1,500+ completed projects | Official site, brief | As published (not externally verifiable) |
| Marques named | BMW, MINI, Porsche, Mercedes-Benz, Land Rover | Old site's meta description | ✅ Text only, no logos |

## 2. Flags for 9WERKS to confirm

1. **PIN code / address.** Google's listing reads "S NO 259/3, **MALL**, SHATIK PARK … Pune, Maharashtra **411067**". The official site and brief say **411007** and have no "MALL". The site uses the official address. Please confirm which is correct.
2. **"Award-winning crew"** on the old site names no award. It is **omitted** until a specific, verifiable award is supplied.
3. **"Certified technicians"** is kept (stated by the business and the brief). Naming the certifying body would strengthen it.
4. **Statistics** (35 / 19 / 1,500+ / 1,500+) are kept exactly as published. Please confirm they are current.
5. **Review figures** change over time. Update `reviews` in `src/content/site.ts` (count + `asOf`) periodically.
6. **"Designed by Synaptechverse"** credit on the old site is not carried over (new build).

## 3. Old site inventory (page by page)

| Page | Key content | CTAs / functions |
|---|---|---|
| `index.html` | Hero "A crew for your luxe ride"; stats; "We specialise in" (4 items); workshop reel; "Why 9WERKS" (3 pillars); six service cards; About teaser; 4-step process; Google rating 4.9/191; gallery; booking CTA; visit block (address, phone, email, hours + open/closed badge, map) | Book a service, WhatsApp, call, Instagram, directions |
| `about.html` | "Built on 35 years of care"; story (3 paragraphs); stats; three pillars; "A crew you can trust" (3 points incl. award claim); gallery | Explore services, book, call |
| `service.html` | "What we do"; six services with 3 inclusions each (anchors `#servicing #diagnostics #brakes #collision #wraps #wheels`); detailing Instagram note; process; "Not sure what you need?" CTA | Book this service (`booking.html?service=<id>`) |
| `contact.html` | "Let's talk cars"; quick links (call, WhatsApp, Instagram, visit); contact form (name*, phone, subject, message*) → WhatsApp; visit block + map | Send on WhatsApp, directions |
| `booking.html` | Form: name*, phone*, car*, service*, date, time, notes → WhatsApp; call panel with hours | Send booking on WhatsApp |

No `robots.txt` or `sitemap.xml` existed (both returned 404).

## 4. The six services (preserved)

| # | Service | Summary (brief) | Inclusions |
|---|---|---|---|
| 01 | Servicing & Routine Checks | Scheduled servicing and routine health checks for exotic, supercar and performance vehicles. | Periodic and scheduled servicing · Oil, filters and fluids · Multi-point health checks |
| 02 | Performance Diagnostics | Modern performance vehicles require accurate diagnostic tools to identify faults. | Full scan and fault-code reading · Electrical and sensor checks · Findings and recommendations |
| 03 | Brakes | Professional brake inspection, servicing and component replacement. | Brake pad and disc inspection · Pad and disc replacement · Brake fluid service |
| 04 | Collision Repair & Paint | Bodywork and paint restoration for scratches, scuffs and collision damage. | Dent and panel repair · Colour-matched paintwork · Scratch and scuff repair |
| 05 | Wraps & Detailing | Vehicle appearance enhancement, protection and detailing. | Vinyl wraps · Wash and interior detailing · Finishing work (+ @9werksdetailzstudio) |
| 06 | Alloy Wheels & Tyres | Alloy wheel services and tyre replacement. | Alloy wheel work · Tyre fitting and replacement · Pressure and wear checks |

No prices, warranties, turnaround times or extra capabilities are stated anywhere on the site.

## 5. Booking & contact workflows (no backend)

Both forms compose a WhatsApp message in the browser and open `https://wa.me/917083199986?text=…`. The visitor reviews it and presses Send. Nothing is submitted to or stored by the website.

**Booking fields:** Full name* · Phone number* (8–15 digits) · Car make and model* · Service* (six services + "Other / not sure", pre-selectable via `?service=<slug or old id>`) · Preferred date (today or later, Asia/Kolkata) · Preferred time (Any / Morning 9–12 / Afternoon 12–4 / Evening 4–9 weekdays; weekend dates only allow Morning or Any) · Additional information.

**Booking message format:**
```
Hi 9WERKS, I'd like to book a service.

*Name:* …
*Phone:* …
*Car:* …
*Service:* …
*Preferred date:* Sat, 14 Nov 2026
*Preferred time:* Morning (9 AM – 12 PM)
*Notes:* …
```
The confirmation panel states plainly: *"This is a request, not a confirmed booking. The 9WERKS crew will reply on WhatsApp to confirm your slot."* It also offers to open WhatsApp again, copy the message, call instead, or edit the details.

**Contact fields:** Full name* · Phone (optional, validated if given) · Subject (optional) · Message* (10–1,500 chars). It sends to WhatsApp, or by email via a `mailto:` fallback.

## 6. How to update content

| To change | Edit |
|---|---|
| Phone, email, address, hours, socials, stats, rating | `src/content/site.ts` |
| Services (copy, inclusions, images, SEO) | `src/content/services.ts` |
| Story, pillars, trust points, process steps | `src/content/company.ts` |
| Photo alt text / captions / provenance | `src/content/photos.ts` |
| Engineering explorer parts and camera views | `src/content/engineering.ts` |

Then run `npm run build` and deploy `out/`.
