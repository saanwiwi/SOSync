import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const BoxesCore = ({ className, ...rest }) => {
  const rows = new Array(100).fill(1);
  const cols = new Array(80).fill(1);
  
  // Tactical Dark Green & Blue emergency palette
  const colors = [
    "#10b981", // bright emerald
    "#059669", // emerald
    "#047857", // deep green
    "#065f46", // dark forest green
    "#34d399", // mint green
    "#0284c7", // tactical ocean blue
    "#38bdf8", // cyan uplink
    "#facc15", // alert amber
    "#0d9488", // teal
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.7) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-[#043627]/60"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `${getRandomColor()}`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="relative h-8 w-16 border-t border-r border-[#043627]/60"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-[#065f46]/70"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);

export default function BackgroundBoxesDemo() {
  return (
    <section className="h-[28rem] relative w-full overflow-hidden bg-[#020817] flex flex-col items-center justify-center border-y border-emerald-500/20 z-10">
      <div className="absolute inset-0 w-full h-full bg-[#020817] z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none opacity-80" />

      <Boxes />

      <div className="relative z-20 text-center px-4 max-w-3xl space-y-3">
        <div className="inline-block font-mono text-[10px] font-bold tracking-widest uppercase bg-yellow-400 text-slate-950 px-3 py-1 rounded shadow-md">
          REAL-TIME MESH MATRIX // KATHMANDU BASIN
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Adaptive Seismic Sensor Grid
        </h2>
        <p className="text-sm md:text-base text-emerald-300/80 font-mono max-w-xl mx-auto">
          Hover across the matrix nodes to inspect telemetry packets transmitted between 142 Himalayan seismic monitoring stations.
        </p>
      </div>
    </section>
  );
}
