/* 9WERKS — site behaviour. No dependencies. */
(function () {
	"use strict";

	var WHATSAPP = "917083199986";
	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	document.documentElement.classList.add("js");

	/* ---------- Header: solid after scrolling ---------- */
	var header = document.querySelector(".site-header");
	var actionBar = document.querySelector(".action-bar");

	function onScroll() {
		var y = window.scrollY;
		if (header) header.classList.toggle("is-solid", y > 24);
		if (actionBar) actionBar.classList.toggle("is-visible", y > 320);
	}

	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	/* ---------- Mobile menu ---------- */
	var toggle = document.querySelector(".menu-toggle");
	var menu = document.getElementById("mobile-menu");

	function setMenu(open) {
		toggle.setAttribute("aria-expanded", String(open));
		toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
		menu.classList.toggle("is-open", open);
		menu.setAttribute("aria-hidden", String(!open));
		document.body.classList.toggle("menu-open", open);
		if (header) header.classList.toggle("is-solid", open || window.scrollY > 24);
		if (open) {
			var first = menu.querySelector("a");
			if (first) first.focus({ preventScroll: true });
		}
	}

	if (toggle && menu) {
		toggle.addEventListener("click", function () {
			setMenu(toggle.getAttribute("aria-expanded") !== "true");
		});
		menu.addEventListener("click", function (e) {
			if (e.target.closest("a")) setMenu(false);
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && menu.classList.contains("is-open")) {
				setMenu(false);
				toggle.focus();
			}
		});
		window.matchMedia("(min-width: 992px)").addEventListener("change", function (mq) {
			if (mq.matches) setMenu(false);
		});
	}

	/* ---------- Reveal on scroll + counters ---------- */
	function countUp(el) {
		var target = parseInt(el.getAttribute("data-count"), 10);
		if (reduceMotion || !target) {
			el.textContent = target.toLocaleString("en-IN");
			return;
		}
		var start = null;
		var duration = 1600;
		function frame(t) {
			if (!start) start = t;
			var p = Math.min((t - start) / duration, 1);
			var eased = 1 - Math.pow(1 - p, 3);
			el.textContent = Math.round(target * eased).toLocaleString("en-IN");
			if (p < 1) requestAnimationFrame(frame);
		}
		requestAnimationFrame(frame);
	}

	var revealEls = document.querySelectorAll(".reveal");
	var counters = document.querySelectorAll("[data-count]");

	if ("IntersectionObserver" in window) {
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					var el = entry.target;
					if (el.hasAttribute("data-count")) countUp(el);
					else el.classList.add("is-in");
					io.unobserve(el);
				});
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
		);
		revealEls.forEach(function (el) { io.observe(el); });
		counters.forEach(function (el) { io.observe(el); });
	} else {
		revealEls.forEach(function (el) { el.classList.add("is-in"); });
		counters.forEach(countUp);
	}

	/* ---------- Video: only load and play when on screen ---------- */
	document.querySelectorAll("video[data-src]").forEach(function (video) {
		if (!("IntersectionObserver" in window)) {
			video.src = video.getAttribute("data-src");
			return;
		}
		var vo = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					if (!video.src) video.src = video.getAttribute("data-src");
					if (!reduceMotion) video.play().catch(function () {});
				} else if (video.src) {
					video.pause();
				}
			});
		}, { threshold: 0.25 });
		vo.observe(video);
	});

	/* ---------- Open / closed badge (Pune time) ---------- */
	// Mon–Fri 09:00–21:00, Sat–Sun 09:00–12:00
	var statusEls = document.querySelectorAll("[data-open-status]");
	if (statusEls.length) {
		try {
			var parts = new Intl.DateTimeFormat("en-GB", {
				timeZone: "Asia/Kolkata",
				weekday: "short",
				hour: "2-digit",
				minute: "2-digit",
				hourCycle: "h23"
			}).formatToParts(new Date());
			var get = function (type) {
				return parts.filter(function (p) { return p.type === type; })[0].value;
			};
			var day = get("weekday");
			var mins = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
			var weekend = day === "Sat" || day === "Sun";
			var close = weekend ? 12 * 60 : 21 * 60;
			var open = mins >= 9 * 60 && mins < close;
			statusEls.forEach(function (el) {
				el.textContent = open ? "Open now" : "Closed now";
				el.classList.add(open ? "is-open" : "is-closed");
			});
		} catch (e) {
			/* Leave the badge empty (hidden by CSS) if time zones are unsupported. */
		}
	}

	/* ---------- Forms → WhatsApp message ---------- */
	var dateInput = document.querySelector('input[type="date"]');
	if (dateInput) {
		var now = new Date();
		var local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
		dateInput.min = local.toISOString().slice(0, 10);
	}

	document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
		form.addEventListener("submit", function (e) {
			e.preventDefault();
			if (!form.reportValidity()) return;

			var lines = [form.getAttribute("data-whatsapp")];
			form.querySelectorAll("[name]").forEach(function (field) {
				var value = (field.value || "").trim();
				if (!value) return;
				if (field.type === "date") {
					value = new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
						weekday: "short", day: "numeric", month: "short", year: "numeric"
					});
				}
				lines.push("*" + field.getAttribute("data-label") + ":* " + value);
			});

			var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
			window.open(url, "_blank", "noopener");
		});
	});

	/* ---------- Footer year ---------- */
	document.querySelectorAll("[data-year]").forEach(function (el) {
		el.textContent = new Date().getFullYear();
	});
})();
