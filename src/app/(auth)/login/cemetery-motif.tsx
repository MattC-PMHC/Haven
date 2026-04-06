/**
 * CemeteryMotif — decorative SVG background for the brand panel.
 *
 * Renders a subtle cemetery scene (headstones, cypress trees, winding
 * path, rolling ground) at very low opacity against the dark navy
 * background. Purely visual — no interactivity.
 */

export function CemeteryMotif() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 800 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {/* ── Rolling ground lines ── */}
        <path
          d="M0 720 Q200 680, 400 710 Q600 740, 800 700"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="40"
          strokeLinecap="round"
        />
        <path
          d="M0 780 Q250 750, 500 770 Q700 790, 800 760"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="50"
          strokeLinecap="round"
        />

        {/* ── Winding path ── */}
        <path
          d="M350 900 Q340 800, 370 720 Q400 640, 380 560 Q360 480, 390 400"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M350 900 Q340 800, 370 720 Q400 640, 380 560 Q360 480, 390 400"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="12 10"
        />

        {/* ── Headstone 1 — rounded top ── */}
        <rect
          x="140"
          y="650"
          width="36"
          height="52"
          rx="12"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="2"
        />
        <rect
          x="146"
          y="700"
          width="24"
          height="8"
          rx="2"
          fill="rgba(255,255,255,0.05)"
        />

        {/* ── Headstone 2 — tall pointed ── */}
        <path
          d="M260 640 L260 690 L240 690 L240 640 L250 625 Z"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* ── Headstone 3 — classic arched ── */}
        <path
          d="M480 660 L480 710 L450 710 L450 660 Q465 640, 480 660 Z"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />

        {/* ── Headstone 4 — simple rectangle ── */}
        <rect
          x="580"
          y="670"
          width="28"
          height="40"
          rx="3"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />

        {/* ── Small cross on headstone 1 ── */}
        <line
          x1="158"
          y1="660"
          x2="158"
          y2="674"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />
        <line
          x1="152"
          y1="666"
          x2="164"
          y2="666"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        {/* ── Cypress tree 1 (tall, narrow) ── */}
        <path
          d="M100 480 Q100 380, 108 300 Q116 380, 116 480 Z"
          fill="rgba(255,255,255,0.05)"
        />
        <line
          x1="108"
          y1="480"
          x2="108"
          y2="510"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />

        {/* ── Cypress tree 2 ── */}
        <path
          d="M650 440 Q650 340, 660 260 Q670 340, 670 440 Z"
          fill="rgba(255,255,255,0.04)"
        />
        <line
          x1="660"
          y1="440"
          x2="660"
          y2="470"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3"
        />

        {/* ── Deciduous tree (rounder canopy) ── */}
        <circle
          cx="720"
          cy="540"
          r="35"
          fill="rgba(255,255,255,0.04)"
        />
        <circle
          cx="740"
          cy="530"
          r="28"
          fill="rgba(255,255,255,0.03)"
        />
        <line
          x1="728"
          y1="565"
          x2="728"
          y2="600"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
        />

        {/* ── Standing cross monument ── */}
        <line
          x1="540"
          y1="580"
          x2="540"
          y2="640"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="3"
        />
        <line
          x1="528"
          y1="598"
          x2="552"
          y2="598"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="3"
        />
        <rect
          x="532"
          y="640"
          width="16"
          height="8"
          rx="2"
          fill="rgba(255,255,255,0.04)"
        />

        {/* ── Scattered dots (pebbles / flowers) ── */}
        <circle cx="200" cy="710" r="3" fill="rgba(255,255,255,0.06)" />
        <circle cx="320" cy="730" r="2.5" fill="rgba(255,255,255,0.05)" />
        <circle cx="430" cy="700" r="2" fill="rgba(255,255,255,0.06)" />
        <circle cx="610" cy="720" r="3" fill="rgba(255,255,255,0.05)" />
        <circle cx="700" cy="690" r="2" fill="rgba(255,255,255,0.04)" />

        {/* ── Distant headstone row (far background) ── */}
        <rect x="180" y="520" width="14" height="20" rx="5" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
        <rect x="210" y="525" width="12" height="16" rx="2" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
        <rect x="236" y="518" width="14" height="22" rx="6" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
        <rect x="264" y="524" width="10" height="14" rx="2" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />

        {/* ── Gentle hill silhouette ── */}
        <path
          d="M0 850 Q200 790, 400 810 Q600 830, 800 800 L800 900 L0 900 Z"
          fill="rgba(255,255,255,0.03)"
        />
      </svg>
    </div>
  )
}
