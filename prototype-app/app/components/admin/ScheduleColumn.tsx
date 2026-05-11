import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { TimeSlot } from "../../types";

interface ScheduleColumnProps {
  availableSlots: TimeSlot[];
  selectedSlot: string | null;
  partsOrdered: boolean;
  offeredSlots: TimeSlot[];
  appointmentConfirmed: boolean;
  onSelectSlot: (slotId: string) => void;
  onConfirmSlot: () => void;
}

export function ScheduleColumn({
  availableSlots,
  selectedSlot,
  partsOrdered,
  appointmentConfirmed,
  onConfirmSlot,
}: ScheduleColumnProps) {
  if (!availableSlots || availableSlots.length === 0) return null;

  const selectedSlotData = availableSlots.find(s => s.id === selectedSlot);

  return (
    <div className="flex-1 min-w-[320px]">
      <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
        Client Selection
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
          {selectedSlot ? '1' : '0'}
        </span>
      </h4>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          Appointment Status
        </div>

        {!selectedSlot && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900 mb-1">
              Waiting for Client
            </div>
            <div className="text-xs text-gray-600">
              {availableSlots.filter(s => s.available).length} slots sent to client for selection
            </div>
            {partsOrdered && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                Parts delivery: May 11
              </div>
            )}
          </div>
        )}

        {selectedSlot && !appointmentConfirmed && selectedSlotData && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-xs font-bold text-blue-900 mb-2">Client Selected:</div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm font-bold text-gray-900">{selectedSlotData.date}</div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedSlotData.time}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onConfirmSlot}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm & Schedule
            </button>
          </div>
        )}

        {appointmentConfirmed && selectedSlotData && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div className="text-sm font-bold text-emerald-900">Confirmed</div>
            </div>
            <div className="text-sm font-semibold text-gray-900">{selectedSlotData.date}</div>
            <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {selectedSlotData.time}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
