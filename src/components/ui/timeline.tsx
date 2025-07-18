"use client";

import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);

  useEffect(() => {
    if (timelineRef.current) {
      setTimelineHeight(timelineRef.current.scrollHeight);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, timelineHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="relative w-full" ref={timelineRef}>
      <div className="absolute left-6 md:left-10 top-0 h-full w-1 bg-gradient-to-b from-transparent via-neutral-600 to-transparent z-0" />

      <motion.div
        className="absolute left-6 md:left-10 top-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent z-10"
        style={{
          height: heightTransform,
          opacity: opacityTransform,
        }}
      />

      <div className="space-y-16 pl-14 md:pl-24 relative z-20">
        {data.map((item, index) => (
          <div key={index} className="relative">
            {/* Dot */}
            <div className="absolute left-[-36px] md:left-[-52px] top-2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10" />

            {/* Content */}
            <div className="text-left">
              <h3 className="text-xl md:text-3xl font-bold text-neutral-200 mb-2">
                {item.title}
              </h3>
              <div className="text-neutral-400">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};