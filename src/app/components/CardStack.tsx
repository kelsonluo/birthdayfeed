import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// ── Original 4 cards (558 × 754) ─────────────────────────────────────────────
import Card1 from "../../imports/Card1/Card1";
import Card2 from "../../imports/Card2/Card2";
import Card4 from "../../imports/Card4/Card4";

// ── Full-page Figma frames ────────────────────────────────────────────────────
import FrameHappyBirthday from "../../imports/Frame2119902906/Frame2119902906";
import FramePoem from "../../imports/Frame2119902904/Frame2119902904-15-4400";
import FrameBlessing from "../../imports/Frame2119902905/Frame2119902905";
import FrameEnding from "../../imports/Frame2119902909-1/Frame2119902909";

// ── New cards / frames (540 × 720) ───────────────────────────────────────────
import CardTao from "../../imports/Card1-1/Card1-14-2944";
import CardYijie from "../../imports/Card2-1/Card2-14-3145";
import CardXiaoCheng from "../../imports/Card2-1-1/Card2-14-3292";
import CardChizi from "../../imports/Card2-2/Card2-14-3417";
import CardJiHao from "../../imports/Card2-3/Card2-14-3566";
import FrameArticle from "../../imports/Frame2119902908-1/Frame2119902908";
import CardPeiyao from "../../imports/Card2-6/Card2-16-4547";
import FrameNotebook from "../../imports/Frame2119902907/Frame2119902907";
import CardYang from "../../imports/Card2-5/Card2-15-4181";

// ── Canvas sizes ──────────────────────────────────────────────────────────────
const ORIG_W = 558;   // original 4 cards
const ORIG_H = 754;
const NEW_W = 540;    // new cards & photo frames
const NEW_H = 720;

// ── Display & animation ───────────────────────────────────────────────────────
// Each card is displayed at 30 vw → expand to 80 vw (scale = 8/3)
const CARD_DISPLAY = "30vw";
const EXPAND_SCALE = 8 / 3;
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DURATION = 0.8;

// ── Full-page frame canvas ────────────────────────────────────────────────────
const FRAME_W = 1280;
const FRAME_HB_H      = 1707;  // Happy Birthday
const FRAME_POEM_H    = 1707;  // 野蔷薇
const FRAME_BLESSING_H = 1707; // 三十之际 / Blessing
const FRAME_ENDING_H  = 1280;  // 故事未完待续 (roughly square)

// ── Gaps ──────────────────────────────────────────────────────────────────────
const GAP = "2.5vw";        // between cards (column + row)  ← was 5vw
const GAP_4X = "10vw";      // separator between group 1 and group 2  ← was 20vw

// ── Card data definitions ─────────────────────────────────────────────────────
interface CardDef {
  Comp: React.ComponentType;
  origW: number;
  origH: number;
  index: number;    // unique global id for active/closing state
}

// Group 1: original 3 cards (Card3 removed) + first 5 new cards  (8 total)
const GROUP_1: CardDef[] = [
  { Comp: Card1 as React.ComponentType,        origW: ORIG_W, origH: ORIG_H, index: 0 },
  { Comp: Card2 as React.ComponentType,        origW: ORIG_W, origH: ORIG_H, index: 1 },
  { Comp: Card4 as React.ComponentType,        origW: ORIG_W, origH: ORIG_H, index: 2 },
  { Comp: CardTao as React.ComponentType,      origW: NEW_W,  origH: NEW_H,  index: 3 },
  { Comp: CardYijie as React.ComponentType,    origW: NEW_W,  origH: NEW_H,  index: 4 },
  { Comp: CardXiaoCheng as React.ComponentType,origW: NEW_W,  origH: NEW_H,  index: 5 },
  { Comp: CardChizi as React.ComponentType,    origW: NEW_W,  origH: NEW_H,  index: 6 },
  { Comp: CardJiHao as React.ComponentType,    origW: NEW_W,  origH: NEW_H,  index: 7 },
];

// Group 2: last 4 new items (4× gap before them)
const GROUP_2: CardDef[] = [
  { Comp: FrameArticle as React.ComponentType, origW: NEW_W,  origH: NEW_H,  index: 8  },
  { Comp: CardPeiyao as React.ComponentType,   origW: NEW_W,  origH: NEW_H,  index: 9  },
  { Comp: FrameNotebook as React.ComponentType,origW: NEW_W,  origH: NEW_H,  index: 10 },
  { Comp: CardYang as React.ComponentType,     origW: NEW_W,  origH: NEW_H,  index: 11 },
];

// ────────────────────────────────────────────────────────────────────────────
// Full-width Figma frame page (scales to viewport width)
// ────────────────────────────────────────────────────────────────────────────
function FramePage({
  FrameComp,
  origW,
  origH,
  style,
}: {
  FrameComp: React.ComponentType;
  origW: number;
  origH: number;
  style?: React.CSSProperties;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / origW);

    // Graceful degradation: fall back to window resize if ResizeObserver unavailable
    if (typeof ResizeObserver === "undefined") {
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const obs = new ResizeObserver(update);
    obs.observe(el);
    update();
    return () => obs.disconnect();
  }, [origW]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${(origH / origW) * 100}%`,
        overflow: "hidden",
        // Isolate paint: changes inside won't cause outer repaints
        contain: "layout paint",
        ...style,
      }}
    >
      <div ref={innerRef} style={{ position: "absolute", inset: 0 }}>
        <div
          style={{
            width: origW,
            height: origH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            // Pre-promote GPU compositing layer for scale transform
            willChange: "transform",
            // Safari: explicitly promote to compositing layer
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <FrameComp />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Individual card item
// ────────────────────────────────────────────────────────────────────────────
interface ActiveInfo {
  index: number;
  dx: number;
  dy: number;
}

interface CardItemProps {
  Comp: React.ComponentType;
  origW: number;
  origH: number;
  globalIndex: number;
  isActive: boolean;
  isClosing: boolean;
  activeInfo: ActiveInfo | null;
  onActivate: (index: number, dx: number, dy: number) => void;
  onDeactivate: () => void;
  onCloseComplete: (index: number) => void;
}

function CardItem({
  Comp,
  origW,
  origH,
  globalIndex,
  isActive,
  isClosing,
  activeInfo,
  onActivate,
  onDeactivate,
  onCloseComplete,
}: CardItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [innerScale, setInnerScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setInnerScale(el.offsetWidth / origW);

    // Graceful degradation: fall back to window resize if ResizeObserver unavailable
    if (typeof ResizeObserver === "undefined") {
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const obs = new ResizeObserver(update);
    obs.observe(el);
    update();
    return () => obs.disconnect();
  }, [origW]);

  const handleClick = useCallback(() => {
    if (isActive) {
      onDeactivate();
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);
    onActivate(globalIndex, dx, dy);
  }, [isActive, globalIndex, onActivate, onDeactivate]);

  const zIndex = isActive ? 50 : isClosing ? 49 : 1;

  return (
    <motion.div
      ref={containerRef}
      style={{
        width: CARD_DISPLAY,
        aspectRatio: `${origW} / ${origH}`,
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        zIndex,
        // Safari GPU compositing promotion for scale/translate animation
        // Note: do NOT add contain:paint here — scale animation overflows layout box
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
      animate={
        isActive && activeInfo
          ? { x: activeInfo.dx, y: activeInfo.dy, scale: EXPAND_SCALE }
          : { x: 0, y: 0, scale: 1 }
      }
      transition={{ duration: DURATION, ease: EASE_OUT }}
      onAnimationComplete={() => {
        if (!isActive && isClosing) onCloseComplete(globalIndex);
      }}
      onClick={handleClick}
    >
      {/* Inner content scaled from origW × origH to fit the 30vw container */}
      <div
        style={{
          width: origW,
          height: origH,
          transform: `scale(${innerScale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          // No willChange here: this div is static after mount.
          // willChange on a non-animated element creates a stale GPU layer
          // that causes a compositing handoff flash on Chrome Android.
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        <Comp />
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Card grid (2 columns × 30 vw each, centred)
// ────────────────────────────────────────────────────────────────────────────
function CardGrid({
  cards,
  activeInfo,
  closingIndex,
  onActivate,
  onDeactivate,
  onCloseComplete,
  paddingTop = GAP,
  paddingBottom = GAP,
}: {
  cards: CardDef[];
  activeInfo: ActiveInfo | null;
  closingIndex: number | null;
  onActivate: (index: number, dx: number, dy: number) => void;
  onDeactivate: () => void;
  onCloseComplete: (index: number) => void;
  paddingTop?: string;
  paddingBottom?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(2, ${CARD_DISPLAY})`,
        justifyContent: "center",
        gap: GAP,
        paddingTop,
        paddingBottom,
      }}
    >
      {cards.map(({ Comp, origW, origH, index }) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            delay: (index % 2) * 0.15,
            duration: 0.75,
            ease: EASE_OUT,
          }}
        >
          <CardItem
            Comp={Comp}
            origW={origW}
            origH={origH}
            globalIndex={index}
            isActive={activeInfo?.index === index}
            isClosing={closingIndex === index}
            activeInfo={activeInfo}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onCloseComplete={onCloseComplete}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main export
// Layout: FrameHB → FramePoem → Group1 (9 cards) → 4× gap → Group2 (4 cards)
// ────────────────────────────────────────────────────────────────────────────
export function CardStack() {
  const [activeInfo, setActiveInfo] = useState<ActiveInfo | null>(null);
  const [closingIndex, setClosingIndex] = useState<number | null>(null);

  // ── Scroll lock ───────────────────────────────────────────────────────────
  // Scroll lock — zero layout change strategy:
  //   • NO overflow:hidden on html/body  → scrollbar stays visible, vw units
  //     never recalculate, no layout reflow, background feed never jumps.
  //   • Window flag  → App.tsx wheel handler skips scrollBy (desktop/trackpad)
  //   • touchmove preventDefault → blocks touch scroll on iOS Safari & Android
  useEffect(() => {
    if (activeInfo !== null) {
      (window as any).__bickyCardOpen = true;

      const preventTouch = (e: TouchEvent) => e.preventDefault();
      document.addEventListener("touchmove", preventTouch, { passive: false });

      return () => {
        (window as any).__bickyCardOpen = false;
        document.removeEventListener("touchmove", preventTouch);
      };
    }
  }, [activeInfo]);

  const handleActivate = useCallback(
    (index: number, dx: number, dy: number) => {
      setClosingIndex(null);
      setActiveInfo({ index, dx, dy });
    },
    []
  );

  const handleDeactivate = useCallback(() => {
    if (activeInfo !== null) {
      setClosingIndex(activeInfo.index);
      setActiveInfo(null);
    }
  }, [activeInfo]);

  const handleCloseComplete = useCallback((index: number) => {
    setClosingIndex((prev) => (prev === index ? null : prev));
  }, []);

  const gridProps = {
    activeInfo,
    closingIndex,
    onActivate: handleActivate,
    onDeactivate: handleDeactivate,
    onCloseComplete: handleCloseComplete,
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeInfo !== null && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "black",
              zIndex: 40,
              cursor: "pointer",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION, ease: EASE_OUT }}
            onClick={handleDeactivate}
          />
        )}
      </AnimatePresence>

      {/* ── Page 1: Happy Birthday ───────────────────────────────────────── */}
      <FramePage FrameComp={FrameHappyBirthday} origW={FRAME_W} origH={FRAME_HB_H} />

      {/* ── Page 2: 野蔷薇 poem — pulled up ~40% of its top-gap ─────────── */}
      <FramePage
        FrameComp={FramePoem}
        origW={FRAME_W}
        origH={FRAME_POEM_H}
        style={{ marginTop: "-12vw" }}
      />

      {/* ── Page 3: 三十之际 / Blessing — pulled up ~40% of its top-gap ─── */}
      <FramePage
        FrameComp={FrameBlessing}
        origW={FRAME_W}
        origH={FRAME_BLESSING_H}
        style={{ marginTop: "-21vw" }}
      />

      {/* ── Group 1: 8 cards (2 per row) ────────────────────────────────── */}
      <CardGrid cards={GROUP_1} {...gridProps} />

      {/* ── Group 2: last 4 cards, separated by 4× gap ─────────────────── */}
      <CardGrid
        cards={GROUP_2}
        {...gridProps}
        paddingTop={GAP_4X}
        paddingBottom={GAP}
      />

      {/* ── Ending page: 故事未完待续 — 50% extra spacing above & below ─── */}
      <FramePage
        FrameComp={FrameEnding}
        origW={FRAME_W}
        origH={FRAME_ENDING_H}
        style={{ marginTop: "2.5vw", marginBottom: "7.5vw" }}
      />
    </div>
  );
}