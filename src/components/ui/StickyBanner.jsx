import React, { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { cn } from '../../lib/utils';

const CloseIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};

export function StickyBanner({
  className,
  children,
  hideOnScroll = false,
}) {
  const [open, setOpen] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (hideOnScroll && latest > 40) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  });

  if (!open) return null;

  return (
    <motion.div
      className={cn(
        'sticky inset-x-0 top-0 z-[60] flex min-h-12 w-full items-center justify-between px-4 py-2 bg-gradient-to-r from-emerald-950 via-[#033b28] to-emerald-950 border-b border-emerald-500/30 text-white shadow-xl',
        className
      )}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex-1 flex items-center justify-center text-center px-4">
        {children}
      </div>

      <button
        aria-label="Dismiss banner"
        className="p-1 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-800/40 transition-colors cursor-pointer flex-shrink-0"
        onClick={() => setOpen(false)}
      >
        <CloseIcon />
      </button>
    </motion.div>
  );
}

export default function EmergencyBanner() {
  return (
    <StickyBanner>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-mono">
        <span className="px-2 py-0.5 rounded bg-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
          CRITICAL OP
        </span>
        <span className="text-emerald-100 font-medium">
          Nepal Earthquake Disaster Relief is active — Autonomous telemetry deployed to Kathmandu Valley.
        </span>
        <a
          href="https://redcross.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-bold underline transition-colors"
        >
          Contribute Relief Fund →
        </a>
      </div>
    </StickyBanner>
  );
}
