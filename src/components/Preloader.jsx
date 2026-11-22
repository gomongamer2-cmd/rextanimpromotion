"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [percent, setPercent] = useState(0);
  const [stage, setStage] = useState(0); // 0 -> 1 -> 2 -> 3
  const rafRef = useRef(0);

  useEffect(() => {
    // If user prefers reduced motion, skip
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMounted(false);
      return;
    }

    const duration = 2000; // 2.0s theatrical duration
    document.body.style.overflow = "hidden";
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      // Exact cubic ease-out from XTE Production: 1 - (1 - t)^3
      setPercent(Math.round((1 - Math.pow(1 - elapsed, 3)) * 100));
      if (elapsed < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), Math.round(0.55 * duration)), // 1100ms
      setTimeout(() => setStage(3), duration),                    // 2000ms
      setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "";
      }, duration + 1050),                                        // 3050ms
    ];

    return () => {
      cancelAnimationFrame(rafRef.current);
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  const isDone = stage >= 3;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: isDone ? "none" : "auto",
        color: "#F4F6F1",
        fontFamily: "'Geist', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 5 Curtain Panels with Staggered Delays (Exact XTE Production) */}
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              marginRight: -1,
              background: "#070806",
              transform: isDone ? "translateY(-101%)" : "translateY(0)",
              transition: `transform .95s cubic-bezier(.76,0,.24,1) ${70 * i}ms`,
            }}
          />
        ))}
      </div>

      {/* Main Content Layer (Fades out when isDone) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isDone ? 0 : 1,
          transition: "opacity .35s ease",
        }}
      >
        {/* Layer 1: Cyber Matrix Blueprint Grid Background behind text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,.08)",
            backgroundImage:
              "linear-gradient(90deg,#070806 11px,transparent 0),linear-gradient(#070806 11px,transparent 0)",
            backgroundSize: "14px 14px",
            WebkitMaskImage: "radial-gradient(70% 55% at 50% 30%,#000,transparent)",
            maskImage: "radial-gradient(70% 55% at 50% 30%,#000,transparent)",
          }}
        />

        {/* Layer 2: Cyber Crimson Radial Light Aura Bloom behind text */}
        <div
          style={{
            position: "absolute",
            left: "-10%",
            right: "-10%",
            bottom: "-45%",
            height: "80%",
            background:
              "radial-gradient(50% 50% at 50% 50%,rgba(255,42,58,.55),rgba(255,42,58,0))",
            filter: "blur(20px)",
            opacity: stage >= 1 ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        />

        {/* Layer 3: Top Navigation Line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "clamp(18px,3vw,32px)",
            fontFamily: "'Geist Mono', monospace, ui-monospace",
            fontSize: 11,
            letterSpacing: ".16em",
            color: "rgba(244,246,241,.6)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="" width={26} height={26} style={{ objectFit: "contain" }} />
            MEX TANIM ESPORTS
          </span>
          <span>/2026</span>
        </div>

        {/* Layer 4: Tactical Slogans */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "clamp(80px,14vh,130px)",
            display: "flex",
            justifyContent: "space-around",
            fontFamily: "'Geist Mono', monospace, ui-monospace",
            fontSize: 10,
            letterSpacing: ".16em",
            lineHeight: 1.5,
            color: "rgba(244,246,241,.45)",
          }}
        >
          <span>
            TOURNAMENTS
            <br />
            WITH PURPOSE.
          </span>
          <span>
            BUILD. BROADCAST.
            <br />
            PRODUCE.
          </span>
        </div>

        {/* Layer 5: Center Monumental Composition */}
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            {/* The Angled Glass Live Card behind the text */}
            <div
              style={{
                position: "absolute",
                width: "min(380px,66vw)",
                aspectRatio: "4/3",
                borderRadius: 26,
                background: "linear-gradient(160deg,rgba(255,255,255,.12),rgba(255,255,255,.03))",
                border: "1px solid rgba(255,255,255,.14)",
                boxShadow: "0 40px 80px -30px rgba(0,0,0,.8)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                padding: 18,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: stage >= 2 ? 1 : 0,
                transform: stage >= 2 ? "translateY(0) rotate(-3deg)" : "translateY(30px) rotate(-6deg)",
                transition: "transform 1.1s cubic-bezier(.16,1,.3,1), opacity .6s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'Geist Mono', monospace, ui-monospace",
                    fontSize: 10,
                    letterSpacing: ".14em",
                    background: "#FF2A3A",
                    color: "#0B0F09",
                    padding: "5px 9px",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#0B0F09",
                    }}
                  />
                  ON AIR
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace, ui-monospace",
                    fontSize: 10,
                    color: "rgba(244,246,241,.5)",
                  }}
                >
                  MATCH 12
                </span>
              </div>
              <span
                style={{
                  height: 10,
                  width: "70%",
                  borderRadius: 6,
                  background: "rgba(255,255,255,.18)",
                }}
              />
              <span
                style={{
                  height: 10,
                  width: "45%",
                  borderRadius: 6,
                  background: "rgba(255,255,255,.1)",
                }}
              />
            </div>

            {/* Giant Monolith Text: MEX TANIM (with slide-up reveal inside overflow hidden) */}
            <div style={{ position: "relative", overflow: "hidden", padding: "0 .04em" }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "clamp(64px,14vw,200px)",
                  lineHeight: 0.82,
                  letterSpacing: "-.07em",
                  transform: stage >= 1 ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 1.1s cubic-bezier(.16,1,.3,1)",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                MEX TANIM
              </div>
            </div>

            {/* Italic Serif Green Accent: Production */}
            <div
              style={{
                position: "absolute",
                right: "-6%",
                bottom: "-18%",
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(36px,5.5vw,80px)",
                lineHeight: 1,
                color: "#FF2A3A",
                opacity: stage >= 2 ? 1 : 0,
                transform: stage >= 2 ? "translateY(0)" : "translateY(18px)",
                transition: "transform .9s cubic-bezier(.16,1,.3,1), opacity .6s ease",
              }}
            >
              Production
            </div>
          </div>
        </div>

        {/* Layer 6: Bottom Percentage & Status & 2px Line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "clamp(18px,3vw,32px)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "clamp(44px,6vw,80px)",
                lineHeight: 0.8,
                letterSpacing: "-.05em",
                fontVariantNumeric: "tabular-nums",
                color: "#F4F6F1",
              }}
            >
              {String(percent).padStart(2, "0")}%
            </span>

            <span
              style={{
                fontFamily: "'Geist Mono', monospace, ui-monospace",
                fontSize: 11,
                letterSpacing: ".16em",
                color: "rgba(244,246,241,.55)",
                textAlign: "right",
              }}
            >
              SETTING UP THE STAGE
              <br />
              CAMERAS · GFX · STREAM
            </span>
          </div>

          <div
            style={{
              height: 2,
              borderRadius: 2,
              background: "rgba(255,255,255,.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#FF2A3A",
                boxShadow: "0 0 12px #FF2A3A",
                transformOrigin: "left",
                transform: `scaleX(${percent / 100})`,
                transition: "transform 0.05s linear",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
