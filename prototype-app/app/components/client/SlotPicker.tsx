import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { TimeSlot } from "../../types";

interface SlotPickerProps {
  availableSlots: TimeSlot[];
  selectedSlot: string | null;
  partsOrdered: boolean;
  onSelectSlot: (slotId: string) => void;
  onConfirmSlot: () => void;
}

export function SlotPicker({
  availableSlots,
  selectedSlot,
  partsOrdered,
  onSelectSlot,
  onConfirmSlot,
}: SlotPickerProps) {
  // Группируем слоты по датам
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const dates = Object.keys(slotsByDate).sort();

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm mb-4"
    >
      <div className="flex gap-3 items-start mb-3">
        <Calendar className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-900 mb-1">Choose Your Appointment Time</div>
          <div className="text-xs text-gray-700 mb-2">
            Select the most convenient time for you
          </div>
          {partsOrdered && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3 text-xs text-amber-700 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Parts delivery: May 11 - available slots from that date</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
        {dates.map((date) => (
          <div key={date} className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {slotsByDate[date].map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onSelectSlot(slot.id)}
                  disabled={!slot.available}
                  className={`p-2 rounded-lg border text-center transition-all text-xs font-semibold ${
                    selectedSlot === slot.id
                      ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-300'
                      : slot.available
                        ? 'bg-white border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-900'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <button
          onClick={onConfirmSlot}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md text-sm"
        >
          ✓ Book This Time
        </button>
      )}
    </motion.div>
  );
}
