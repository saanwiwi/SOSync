"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FeatureTabs = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    // ... rest of your return statement stays exactly the same
    <div className="w-full bg-white dark:bg-neutral-950 py-12 px-4 md:px-10 rounded-3xl border border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-3">
          Explore System Features
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-xl">
          Select a category below to toggle between different modules, updates, and platform capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-start">
        {/* Toggle Controls (Side / Top Tabs) */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
          {data.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative text-left px-5 py-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between border ${
                  isActive
                    ? "border-neutral-300 dark:border-neutral-700 text-black dark:text-white shadow-md"
                    : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-feature-tab"
                    className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 rounded-2xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="relative z-10 font-bold text-base md:text-lg">
                  {item.title}
                </div>
                {isActive && (
                  <span className="relative z-10 text-xs font-semibold px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full border border-cyan-500/20">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feature Display Window */}
        <div className="lg:col-span-8 bg-neutral-50/80 dark:bg-neutral-900/40 p-6 md:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <h3 className="text-xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                {data[activeIndex].title}
              </h3>
              {data[activeIndex].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};