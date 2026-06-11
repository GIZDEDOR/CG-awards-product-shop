import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { products } from "../data/products";
import { smooth } from "../utils/math";
import { playSound } from "../utils/sound";

function getScanFrameOffset(index) {
  const isMobile = window.innerWidth <= 640;
  const desktop = [
    [0, window.innerHeight * 0.16],
    [window.innerWidth * 0.24, window.innerHeight * 0.08],
    [window.innerWidth * 0.08, window.innerHeight * 0.18],
    [-window.innerWidth * 0.22, window.innerHeight * 0.02],
  ];
  const mobile = [
    [0, window.innerHeight * 0.1],
    [window.innerWidth * 0.1, window.innerHeight * 0.08],
    [-window.innerWidth * 0.04, window.innerHeight * 0.12],
    [-window.innerWidth * 0.08, window.innerHeight * 0.04],
  ];
  const [x, y] = (isMobile ? mobile : desktop)[index] || [0, 0];

  return {
    x: isMobile ? x / 0.45 : x,
    y: isMobile ? y / 0.65 : y,
  };
}

function splitWords() {
  gsap.utils.toArray(".split-words").forEach((el) => {
    if (el.dataset.splitReady === "true") return;
    const text = el.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;
    el.dataset.splitReady = "true";
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(" ")
      .map(
        (word) =>
          `<span class="motion-word" aria-hidden="true"><span class="motion-word-inner">${word}</span></span>`
      )
      .join(" ");
  });
}

export function usePageMotion() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      splitWords();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(".loader", { autoAlpha: 0 });
        gsap.set(
          ".reveal, .reveal-text, .label, .product-photo, .hero-media, .intro-image, .motion-word-inner",
          { clearProps: "all" }
        );
        return;
      }

      gsap.set("section", { "--section-veil": 0.34 });
      gsap.set(".motion-word-inner", { yPercent: 108, rotate: 1.5, opacity: 0 });
      gsap.set(".hero .eyebrow, .hero-center > p:last-child, .hero-copy p", {
        y: 24,
        opacity: 0,
      });
      gsap.set(".hero-media", { clipPath: "inset(10% round 16px)", opacity: 0 });

      const loadTl = gsap.timeline({ defaults: { ease: "expo.out" } });
      loadTl
        .fromTo(".loader-receipt", { yPercent: -115 }, { yPercent: 0, duration: 1.1, delay: 0.25 })
        .to(".loader-receipt", { y: 18, opacity: 0, duration: 0.55, ease: "power2.in" }, "+=0.78")
        .to(".loader", { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "-=0.18")
        .to(".hero", { "--section-veil": 0.03, duration: 1.2 }, "-=0.65")
        .to(".hero-media", { clipPath: "inset(0% round 16px)", opacity: 0.92, duration: 1.2 }, "-=0.72")
        .fromTo(
          ".hero-media img",
          { scale: 1.12, yPercent: -6 },
          { scale: 1.015, yPercent: 0, duration: 1.5 },
          "-=1.05"
        )
        .to(".hero .eyebrow", { y: 0, opacity: 1, duration: 0.62 }, "-=0.82")
        .to(".hero .motion-word-inner", { yPercent: 0, rotate: 0, opacity: 1, duration: 0.9, stagger: 0.075 }, "-=0.52")
        .to(".hero-center > p:last-child", { y: 0, opacity: 1, duration: 0.72 }, "-=0.48")
        .to(".hero-copy p", { y: 0, opacity: 1, duration: 0.6, stagger: 0.055 }, "-=0.48");

      gsap.utils.toArray("section").forEach((section) => {
        gsap.fromTo(
          section,
          { "--section-veil": 0.42 },
          {
            "--section-veil": 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              end: "top 22%",
              scrub: 1.15,
            },
          }
        );
      });

      gsap.to(".site-header", {
        y: -8,
        scale: 0.985,
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "+=240",
          scrub: true,
        },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
        .to(".hero-center", { yPercent: -12, opacity: 0.24, ease: "none" }, 0)
        .to(".hero-media", { yPercent: 7, scale: 0.985, opacity: 0.5, ease: "none" }, 0)
        .to(".hero-copy", { y: -18, opacity: 0, ease: "none" }, 0);

      gsap.utils.toArray(".reveal-text").forEach((el) => {
        if (el.closest(".hero") || el.closest(".product")) return;
        gsap.fromTo(
          el,
          { y: 52, opacity: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.05,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }
        );
      });

      gsap.utils.toArray(".reveal").forEach((el) => {
        if (el.closest(".hero") || el.closest(".product") || el.classList.contains("product-index")) {
          return;
        }
        gsap.fromTo(
          el,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.86,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 84%", once: true },
          }
        );
      });

      gsap.utils.toArray(".intro-image, .final-media").forEach((media) => {
        gsap.fromTo(
          media,
          { clipPath: "inset(14% round 16px)", opacity: 0.52 },
          {
            clipPath: "inset(0% round 16px)",
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: media,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray(".split-words").forEach((el) => {
        if (el.closest(".hero") || el.closest(".product")) return;
        gsap.to(el.querySelectorAll(".motion-word-inner"), {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.82,
          ease: "expo.out",
          stagger: 0.055,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        });
      });

      gsap.fromTo(
        ".product-index span",
        { y: 22, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: {
            trigger: ".product-index",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.utils.toArray(".product-photo img, .final-media img, .hero-media img, .intro-image img").forEach((image) => {
        const trigger = image.closest("figure, .final-media, .hero-media, .intro-image");
        gsap.fromTo(
          image,
          { yPercent: -7 },
          {
            yPercent: 2.5,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.15,
            },
          }
        );
      });

      gsap.utils.toArray(".product").forEach((section) => {
        const copy = section.querySelector(".product-copy");
        const category = section.querySelector(".product-category");
        const titleWords = section.querySelectorAll(".product-copy .motion-word-inner");
        const bodies = section.querySelectorAll(".product-copy .body, .product-copy blockquote");
        const photo = section.querySelector(".product-photo");
        const label = section.querySelector(".label");
        const callout = section.querySelector(".product-callout");
        const stagedElements = [category, ...bodies, label, callout].filter(Boolean);
        const isReverseLayout = section.classList.contains("product-layout-1");

        gsap.set(stagedElements, { y: 30, opacity: 0 });
        gsap.set(photo, {
          clipPath: "inset(16% round 16px)",
          opacity: 0.5,
          xPercent: isReverseLayout ? -4 : 4,
          scale: 0.985,
        });

        const productTl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "top 22%",
            scrub: 0.95,
          },
        });

        productTl
          .to(photo, { clipPath: "inset(0% round 16px)", opacity: 0.88, xPercent: 0, scale: 1, duration: 1.2 }, 0)
          .to(category, { y: 0, opacity: 1, duration: 0.42 }, 0.12)
          .to(titleWords, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.82, stagger: 0.035 }, 0.2)
          .to(bodies, { y: 0, opacity: 1, duration: 0.7, stagger: 0.075 }, 0.48)
          .to(callout, { y: 0, opacity: 1, duration: 0.58 }, 0.6)
          .to(label, { y: 0, opacity: 1, duration: 0.64 }, 0.68);

        gsap.to(copy, {
          yPercent: -2.5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.25,
          },
        });

        gsap.to(photo, {
          scale: 0.975,
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "55% center",
            end: "bottom top",
            scrub: 1.25,
          },
        });
      });

      gsap.utils.toArray(".product-callout").forEach((callout) => {
        gsap.to(callout, {
          rotate: 0.8,
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: callout.closest(".product"),
            start: "top 72%",
            end: "bottom 28%",
            scrub: 1.2,
          },
        });
      });

      gsap.utils.toArray(".product-side").forEach((side) => {
        gsap.to(side, {
          xPercent: -4,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: side.closest(".product"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      gsap.fromTo(
        ".scan-line",
        { yPercent: -15 },
        {
          yPercent: 112,
          repeat: -1,
          duration: 1.25,
          ease: "power1.inOut",
          yoyo: true,
        }
      );

      const playedScans = new Set();
      gsap.set(".scan-hud", { autoAlpha: 0 });
      gsap.set(".scan-frame", { "--scan-x": "0px", "--scan-y": "0px" });
      gsap.set(".scan-number-item", { autoAlpha: 0 });
      gsap.set(".scan-number-0", { autoAlpha: 1 });
      products.forEach((_, index) => {
        const receiptLine = `.receipt-line-${index}`;
        gsap.set(receiptLine, { clipPath: "inset(0 100% 0 0)" });

        ScrollTrigger.create({
          trigger: `.product-${index + 1}`,
          start: "top top",
          end: "bottom 34%",
          scrub: true,
          onEnter: () => gsap.set(".scan-hud", { autoAlpha: 0 }),
          onEnterBack: () => gsap.set(".scan-hud", { autoAlpha: 0 }),
          onLeave: () => {
            if (index === products.length - 1) {
              gsap.to(".scan-hud", { autoAlpha: 0, duration: 0.25 });
            }
          },
          onLeaveBack: () => {
            if (index === 0) {
              gsap.to(".scan-hud", { autoAlpha: 0, duration: 0.25 });
            }
          },
          onUpdate: (self) => {
            const printed = smooth(0.76, 0.94, self.progress);
            const frameOffset = getScanFrameOffset(index);
            const frameTravel = smooth(0.42, 0.66, self.progress);
            const hudVisibility = smooth(0.36, 0.54, self.progress) * (1 - smooth(0.92, 1, self.progress));

            gsap.set(".scan-hud", { autoAlpha: hudVisibility });
            gsap.set(".scan-frame", {
              "--scan-x": `${frameOffset.x * frameTravel}px`,
              "--scan-y": `${frameOffset.y * frameTravel}px`,
            });
            gsap.set(".scan-number-item", { autoAlpha: 0 });
            gsap.set(`.scan-number-${index}`, { autoAlpha: 1 });
            gsap.set(receiptLine, { clipPath: `inset(0 ${100 - printed * 100}% 0 0)` });

            if (self.progress > 0.62 && !playedScans.has(index)) {
              playedScans.add(index);
              playSound("beep.mp3");
              window.setTimeout(() => playSound("print2.1.mp3"), 180);
            }

            if (self.progress < 0.18) {
              playedScans.delete(index);
            }
          },
        });
      });

      gsap.to(".receipt-final", {
        y: 0,
        opacity: 1,
        rotate: -2,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".final", start: "top 56%" },
      });

      gsap.fromTo(
        ".scanner",
        { clipPath: "inset(8% 8% 8% 8%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".scanner", start: "top 80%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);
}
