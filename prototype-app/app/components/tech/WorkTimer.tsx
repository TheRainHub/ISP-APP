import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface WorkTimerProps {
  startTime: number | null;
  orderStatus: string;
}

export function WorkTimer({ startTime, orderStatus }: WorkTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startTime || orderStatus !== "in_progress") {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, orderStatus]);

  if (!startTime || orderStatus !== "in_progress") {
    return null;
  }

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl p-4 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="bg-amber-500 rounded-full p-2">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">
            Work Time
          </div>
          <div className="flex items-center gap-1 font-mono">
            <motion.span
              key={hours}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-amber-900"
            >
              {formatTime(hours)}
            </motion.span>
            <span className="text-xl text-amber-700">:</span>
            <motion.span
              key={minutes}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-amber-900"
            >
              {formatTime(minutes)}
            </motion.span>
            <span className="text-xl text-amber-700">:</span>
            <motion.span
              key={seconds}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-amber-900"
            >
              {formatTime(seconds)}
            </motion.span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-amber-700">
        Standard time: 1.5 hours
      </div>
    </motion.div>
  );
}
