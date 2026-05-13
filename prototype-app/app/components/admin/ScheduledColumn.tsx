import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Package, CheckCircle, Wrench } from "lucide-react";
import { TimeSlot, OrderStatus } from "../../types";

interface ScheduledColumnProps {
  orderStatus: OrderStatus;
  selectedSlot: string | null;
  availableSlots: TimeSlot[];
  formData: {
    vehicle: string;
    vin: string;
  };
  appointmentConfirmed: boolean;
  partsOrdered: boolean;
  onAdminSend: () => void;
  onOrderParts: () => void;
}

export function ScheduledColumn({
  orderStatus,
  selectedSlot,
  availableSlots,
  formData,
  appointmentConfirmed,
  partsOrdered,
  onAdminSend,
  onOrderParts,
}: ScheduledColumnProps) {
  return (
    <div className="flex-1 min-w-[280px]">
      <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
        Scheduled
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
          {orderStatus === 'accepted' ? '1' : '0'}
        </span>
      </h4>
      {orderStatus === 'accepted' && selectedSlot && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-l-4 border-l-blue-500 border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="font-bold mb-2 text-gray-900">{formData.vehicle} · {formData.vin}</div>
          <div className="text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3" />
              {availableSlots.find(s => s.id === selectedSlot)?.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {availableSlots.find(s => s.id === selectedSlot)?.time}
            </div>
          </div>
          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase mb-3 inline-block">
            {appointmentConfirmed ? 'Ready for Service' : 'Finalizing Schedule'}
          </span>

          {appointmentConfirmed && (
            <div className="space-y-2 mt-4">
              {!partsOrdered ? (
                <button
                  onClick={onOrderParts}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Order Missing Parts
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[10px] text-emerald-700 font-bold flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Parts Ordered
                </div>
              )}
              
              <button
                onClick={onAdminSend}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                Send to Repair Bay
              </button>
            </div>
          )}

          {!appointmentConfirmed && (
            <div className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg text-xs font-bold text-center mt-4">
              Waiting for client confirmation...
            </div>
          )}
        </motion.div>
      )}

      {orderStatus === 'in_progress' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border-l-4 border-l-emerald-500 border border-emerald-200 rounded-xl p-4 shadow-sm">
           <div className="font-bold mb-2 text-gray-900">{formData.vehicle}</div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 mb-3">
             <Wrench className="w-3.5 h-3.5" />
             IN REPAIR BAY
           </div>
           <div className="text-[10px] text-emerald-800 space-y-1">
             <div>Started: 10:00 AM</div>
             <div>Est. Finish: 11:30 AM</div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
