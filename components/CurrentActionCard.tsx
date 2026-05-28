"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Activity, Database, ShieldCheck, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActionRisk = "normal" | "watch" | "fall";
type PoseKind =
  | "walk"
  | "stand"
  | "lie"
  | "sit-stand"
  | "limp"
  | "support"
  | "stumble"
  | "stairs"
  | "car"
  | "slow-fall"
  | "collapse"
  | "back-fall"
  | "side-fall";

interface ActionClass {
  name: string;
  label: 0 | 1;
  samples: number;
  windows: number;
  risk: ActionRisk;
  pose: PoseKind;
  confidence: number;
  note: string;
}

const actionClasses: ActionClass[] = [
  {
    name: "เดินปกติ",
    label: 0,
    samples: 618,
    windows: 58,
    risk: "normal",
    pose: "walk",
    confidence: 91,
    note: "การเดินอยู่ในจังหวะปกติ",
  },
  {
    name: "ยืน",
    label: 0,
    samples: 203,
    windows: 17,
    risk: "normal",
    pose: "stand",
    confidence: 88,
    note: "ตรวจพบการยืนอยู่กับที่",
  },
  {
    name: "นอน",
    label: 0,
    samples: 371,
    windows: 34,
    risk: "normal",
    pose: "lie",
    confidence: 89,
    note: "ท่าทางอยู่ในระดับพักผ่อน",
  },
  {
    name: "ลุกยืนสลับนั่ง",
    label: 0,
    samples: 1153,
    windows: 112,
    risk: "watch",
    pose: "sit-stand",
    confidence: 86,
    note: "ควรสังเกตช่วงเปลี่ยนท่า",
  },
  {
    name: "เดินกระเพก",
    label: 0,
    samples: 1631,
    windows: 160,
    risk: "watch",
    pose: "limp",
    confidence: 92,
    note: "การลงน้ำหนักเท้าไม่เท่ากัน",
  },
  {
    name: "คนแก่จับของระหว่างทาง",
    label: 0,
    samples: 1284,
    windows: 125,
    risk: "watch",
    pose: "support",
    confidence: 87,
    note: "มีการพยุงตัวระหว่างเดิน",
  },
  {
    name: "สะดุดเดิน",
    label: 0,
    samples: 2800,
    windows: 265,
    risk: "watch",
    pose: "stumble",
    confidence: 90,
    note: "พบจังหวะเดินสะดุด ควรคอยดู",
  },
  {
    name: "เดินขึ้นลงบันได",
    label: 0,
    samples: 2800,
    windows: 268,
    risk: "watch",
    pose: "stairs",
    confidence: 84,
    note: "การขึ้นลงระดับพื้นมีความเสี่ยงเพิ่ม",
  },
  {
    name: "ขึ้นลงรถ",
    label: 0,
    samples: 1395,
    windows: 120,
    risk: "watch",
    pose: "car",
    confidence: 82,
    note: "ช่วงก้าวข้ามธรณีควรระวัง",
  },
  {
    name: "ค่อยๆล้ม",
    label: 1,
    samples: 2188,
    windows: 205,
    risk: "fall",
    pose: "slow-fall",
    confidence: 94,
    note: "ตรวจพบแนวโน้มทรงตัวเสีย",
  },
  {
    name: "ล้มแบบค่อยๆทรุด",
    label: 1,
    samples: 4113,
    windows: 342,
    risk: "fall",
    pose: "collapse",
    confidence: 95,
    note: "ควรให้ผู้ดูแลตรวจสอบทันที",
  },
  {
    name: "ล้มไปด้านหลัง",
    label: 1,
    samples: 8781,
    windows: 805,
    risk: "fall",
    pose: "back-fall",
    confidence: 96,
    note: "รูปแบบเสี่ยงสูงมาก",
  },
  {
    name: "ล้มข้าง",
    label: 1,
    samples: 8796,
    windows: 806,
    risk: "fall",
    pose: "side-fall",
    confidence: 96,
    note: "ควรแจ้งผู้ดูแลทันที",
  },
];

const riskStyles: Record<ActionRisk, { label: string; card: string; chip: string; icon: typeof ShieldCheck }> = {
  normal: {
    label: "ปกติ",
    card: "border-emerald-200 bg-emerald-50/70",
    chip: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    icon: ShieldCheck,
  },
  watch: {
    label: "ควรสังเกต",
    card: "border-amber-200 bg-amber-50/70",
    chip: "bg-amber-100 text-amber-800 ring-amber-200",
    icon: Activity,
  },
  fall: {
    label: "เสี่ยงล้ม",
    card: "border-rose-200 bg-rose-50/80",
    chip: "bg-rose-100 text-rose-800 ring-rose-200",
    icon: TriangleAlert,
  },
};

export function CurrentActionCard() {
  const [index, setIndex] = useState(0);
  const action = actionClasses[index];
  const riskStyle = riskStyles[action.risk];
  const RiskIcon = riskStyle.icon;
  const datasetSummary = useMemo(
    () => ({
      totalWindows: 3435,
      windowDuration: 2,
      sampleRate: 20,
    }),
    [],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % actionClasses.length);
    }, 3800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card className={cn("overflow-hidden", riskStyle.card)}>
      <CardContent className="p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-slate-700">กำลังทำอยู่</span>
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ring-1", riskStyle.chip)}>
              <RiskIcon className="h-3.5 w-3.5" />
              {riskStyle.label}
            </span>
          </div>

          <motion.div
            key={action.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="mt-2"
          >
            <h3 className="text-2xl font-extrabold tracking-normal text-slate-950">
              {action.name}
            </h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
              {action.note}
            </p>
          </motion.div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <Metric label="AI มั่นใจ" value={`${action.confidence}%`} />
            <Metric label="Windows" value={action.windows.toLocaleString()} />
            <Metric label="Samples" value={action.samples.toLocaleString()} />
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700">
            <Database className="h-4 w-4 text-cyan-700" />
            <span>
              ชุดข้อมูล {datasetSummary.totalWindows.toLocaleString()} windows · {datasetSummary.windowDuration}s/window · {datasetSummary.sampleRate}Hz
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
      <div className="font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-slate-950">{value}</div>
    </div>
  );
}

function PoseIllustration({ pose, risk }: { pose: PoseKind; risk: ActionRisk }) {
  const stroke = risk === "fall" ? "#e11d48" : risk === "watch" ? "#d97706" : "#059669";
  const glow = risk === "fall" ? "#fecdd3" : risk === "watch" ? "#fde68a" : "#bbf7d0";

  return (
    <motion.svg
      key={pose}
      viewBox="0 0 160 132"
      role="img"
      aria-label={`ท่าทาง ${pose}`}
      className="h-[132px] w-full"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32 }}
    >
      <rect x="8" y="98" width="144" height="10" rx="5" fill="#e2e8f0" />
      <motion.ellipse
        cx="80"
        cy="68"
        rx="48"
        ry="42"
        fill={glow}
        opacity="0.45"
        animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.32, 0.48, 0.32] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <PoseLines pose={pose} stroke={stroke} />
    </motion.svg>
  );
}

function PoseLines({ pose, stroke }: { pose: PoseKind; stroke: string }) {
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (pose === "stand") {
    return (
      <g>
        <circle cx="80" cy="30" r="11" fill={stroke} />
        <path {...common} d="M80 44 V76 M80 76 L66 103 M80 76 L94 103 M80 54 L62 68 M80 54 L98 68" />
      </g>
    );
  }

  if (pose === "lie") {
    return (
      <g>
        <circle cx="48" cy="86" r="11" fill={stroke} />
        <path {...common} d="M60 86 H104 M104 86 L130 78 M104 86 L130 96 M72 86 L56 72" />
      </g>
    );
  }

  if (pose === "sit-stand") {
    return (
      <g>
        <rect x="94" y="78" width="36" height="24" rx="6" fill="#cbd5e1" />
        <circle cx="76" cy="36" r="11" fill={stroke} />
        <path {...common} d="M76 50 L82 72 M82 72 H106 M82 72 L68 100 M76 56 L56 72 M76 56 L96 64" />
      </g>
    );
  }

  if (pose === "limp") {
    return (
      <g>
        <circle cx="76" cy="30" r="11" fill={stroke} />
        <path {...common} d="M76 44 L84 72 M84 72 L60 101 M84 72 L106 92 M80 54 L60 70 M82 56 L104 56" />
        <path d="M106 92 L118 101" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }

  if (pose === "support") {
    return (
      <g>
        <path d="M116 48 V104" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
        <circle cx="76" cy="30" r="11" fill={stroke} />
        <path {...common} d="M76 44 L84 72 M84 72 L68 101 M84 72 L102 101 M82 56 L116 58 M76 56 L58 72" />
      </g>
    );
  }

  if (pose === "stumble") {
    return (
      <g>
        <circle cx="66" cy="30" r="11" fill={stroke} />
        <path {...common} d="M70 44 L92 66 M92 66 L62 100 M92 66 L122 86 M78 52 L52 58 M84 56 L110 42" />
        <path d="M118 101 H138" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }

  if (pose === "stairs") {
    return (
      <g>
        <path d="M30 104 H62 V86 H92 V68 H124" stroke="#94a3b8" strokeWidth="6" fill="none" strokeLinejoin="round" />
        <circle cx="72" cy="28" r="11" fill={stroke} />
        <path {...common} d="M74 42 L84 66 M84 66 L66 86 M84 66 L108 68 M78 52 L58 62 M80 52 L100 42" />
      </g>
    );
  }

  if (pose === "car") {
    return (
      <g>
        <rect x="91" y="68" width="42" height="28" rx="6" fill="#cbd5e1" />
        <circle cx="70" cy="30" r="11" fill={stroke} />
        <path {...common} d="M70 44 L82 70 M82 70 L70 101 M82 70 L112 78 M76 54 L58 74 M78 56 L108 66" />
      </g>
    );
  }

  if (pose === "slow-fall") {
    return (
      <g>
        <circle cx="64" cy="34" r="11" fill={stroke} />
        <path {...common} d="M72 46 L96 70 M96 70 L76 102 M96 70 L126 96 M82 54 L54 58 M88 60 L116 48" />
      </g>
    );
  }

  if (pose === "collapse") {
    return (
      <g>
        <circle cx="72" cy="54" r="11" fill={stroke} />
        <path {...common} d="M78 66 L86 88 M86 88 L58 104 M86 88 L120 104 M78 72 L54 82 M82 74 L108 80" />
      </g>
    );
  }

  if (pose === "back-fall") {
    return (
      <g>
        <circle cx="98" cy="42" r="11" fill={stroke} />
        <path {...common} d="M88 52 L62 74 M62 74 L42 104 M62 74 L92 104 M78 58 L106 62 M72 64 L48 56" />
      </g>
    );
  }

  if (pose === "side-fall") {
    return (
      <g>
        <circle cx="60" cy="58" r="11" fill={stroke} />
        <path {...common} d="M72 62 L104 76 M104 76 L80 104 M104 76 L136 96 M82 66 L58 82 M88 70 L116 54" />
      </g>
    );
  }

  return (
    <g>
      <motion.circle
        cx="76"
        cy="30"
        r="11"
        fill={stroke}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        {...common}
        d="M76 44 L82 72 M82 72 L62 101 M82 72 L110 96 M78 54 L56 68 M80 54 L104 62"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}
