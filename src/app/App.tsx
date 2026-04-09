import { useEffect } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/Bicky/svg-rbm9dtocpg";
import imgImage583 from "../imports/Bicky/ee42e4da889899af6dbc16f371f1605dddb35110.png";
import { CardStack } from "./components/CardStack";

export default function App() {
  // ── Slight scroll resistance (wheel events scaled to ~65%) ──────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Skip scrollBy while a card is open (CardStack sets this flag)
      if ((window as any).__bickyCardOpen) return;
      window.scrollBy({
        top: e.deltaY * 0.25,
        left: e.deltaX * 0.25,
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#faf5e3",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // Ensure custom wheel handler works correctly on touch devices
        touchAction: "pan-y",
      }}
    >
      {/* ── Bicky Hero Section ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1271px",
          paddingBottom: "224.9%",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>

          {/* "To Bicky." gold cursive SVG */}
          <div
            style={{
              position: "absolute",
              top: "22.91%",
              left: "29.53%",
              right: "26.55%",
              bottom: "71.66%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: "rotate(-1.78deg)",
                width: "100%",
                height: "100%",
              }}
            >
              <svg
                viewBox="0 0 558.291 133.319"
                fill="none"
                style={{ width: "100%", height: "100%" }}
                preserveAspectRatio="xMidYMid meet"
              >
                <path d={svgPaths.p33176600} fill="#BC9249" />
              </svg>
            </div>
          </div>

          {/* Botanical flower illustration */}
          <div
            style={{
              position: "absolute",
              left: "32.5%",
              top: "35.7%",
              width: "35.8%",
              height: "27.7%",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <img
              alt=""
              src={imgImage583}
              style={{
                position: "absolute",
                width: "207.96%",
                height: "179.48%",
                left: "-53.98%",
                top: "-39.74%",
                maxWidth: "none",
              }}
            />
          </div>

          {/* Arrow / chevron — outer div handles centering, motion.div handles float */}
          <div
            style={{
              position: "absolute",
              top: "83.05%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "7.14%",
              // Pre-promote to compositing layer: infinite animation runs entirely on GPU
              willChange: "transform",
            }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <svg
                viewBox="0 0 98.7245 52.5487"
                fill="none"
                style={{ width: "100%", height: "auto", display: "block" }}
              >
                <path d={svgPaths.p25d53a80} fill="#BC9249" />
                <path
                  d={svgPaths.p3c8f4be8}
                  stroke="#BC9249"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Four Card Stack Section ── */}
      <CardStack />
    </div>
  );
}