import React from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle, Truck, AlertCircle, Wrench, Users, Calendar, Clock } from "lucide-react";
import { Part, TimeSlot } from "../../types";
import { mockBays, mockMechanics } from "../../constants/mockData";

interface PartsReviewColumnProps {
  requiredParts: Part[];
  resourcesAllocated: boolean;
  selectedBay: string | null;
  selectedMechanics: string[];
  partsOrdered: boolean;
  availableSlots: TimeSlot[];
  onCheckParts: () => void;
}

export function PartsReviewColumn({
  requiredParts,
  resourcesAllocated,
  selectedBay,
  selectedMechanics,
  partsOrdered,
  availableSlots,
  onCheckParts,
}: PartsReviewColumnProps) {
  if (!requiredParts || requiredParts.length === 0) return null;

  return (
    <div className="flex-1 min-w-[320px]">
      <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
        Parts Review
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
          {requiredParts.length > 0 ? '1' : '0'}
        </span>
      </h4>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-600" />
          Required Parts
        </div>

        <div className="space-y-2 mb-4">
          {requiredParts.map((part) => (
            <div key={part.id} className={`p-3 rounded-lg border ${part.available ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex justify-between items-start mb-1">
                <div className="text-sm font-medium text-gray-900">{part.name}</div>
                <div className="text-xs font-bold text-gray-700">{part.price} Kč</div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {part.available ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">In stock ({part.quantity})</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-3 h-3 text-amber-600" />
                    <span className="text-amber-700">Order needed - ETA: {part.estimatedDelivery}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {resourcesAllocated && (
          <div className="mb-4 space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="font-bold text-sm text-blue-900 mb-2 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Assigned Bay
              </div>
              {selectedBay && (() => {
                const bay = mockBays.find(b => b.id === selectedBay);
                return bay ? (
                  <div className="text-xs text-blue-800 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                    {bay.name}
                  </div>
                ) : null;
              })()}
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="font-bold text-sm text-purple-900 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assigned Mechanics
              </div>
              <div className="space-y-1">
                {selectedMechanics.map(mechId => {
                  const mech = mockMechanics.find(m => m.id === mechId);
                  return mech ? (
                    <div key={mechId} className="text-xs text-purple-800 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-purple-600" />
                        {mech.name}
                      </span>
                      <span className="text-[10px] bg-purple-100 px-2 py-0.5 rounded-full">
                        {mech.specialty}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {!partsOrdered && requiredParts.some(p => !p.available) && (
          <button
            onClick={onCheckParts}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Order Missing Parts
          </button>
        )}

        {partsOrdered && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold mb-1">✓ Parts ordered from factory</div>
              <div>Estimated delivery: May 11, 2026</div>
              <div className="mt-2 text-emerald-700 font-semibold">→ Check available slots after delivery date</div>
            </div>
          </div>
        )}

        {requiredParts.every(p => p.available) && !availableSlots.length && (
          <button
            onClick={onCheckParts}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
          >
            Show Available Slots
          </button>
        )}
      </motion.div>
    </div>
  );
}
