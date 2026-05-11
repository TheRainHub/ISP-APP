import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Wrench, User } from "lucide-react";
import { mockSchedule, mockBays, mockMechanics } from "../../constants/mockData";

type ScheduleViewType = "timeline" | "bays" | "mechanics";

export function ScheduleView() {
  const [viewType, setViewType] = useState<ScheduleViewType>("timeline");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Schedule - May 10, 2026</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType("timeline")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewType === "timeline"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Timeline
          </button>
          <button
            onClick={() => setViewType("bays")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewType === "bays"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Wrench className="w-4 h-4 inline mr-2" />
            Bay Schedule
          </button>
          <button
            onClick={() => setViewType("mechanics")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewType === "mechanics"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Mechanic Schedule
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {viewType === "timeline" && (
          <div className="space-y-3">
            {mockSchedule.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all ${
                  item.status === 'completed' ? 'border-emerald-200 opacity-60' :
                  item.status === 'in_progress' ? 'border-amber-300' :
                  'border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg px-4 py-2 min-w-[80px]">
                  <Clock className="w-4 h-4 text-gray-500 mb-1" />
                  <div className="text-sm font-bold text-gray-900">{item.time}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-gray-900">{item.vehicle} · {item.vin}</div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status === 'completed' ? 'Completed' : item.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{item.clientName} · {item.service}</div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.duration}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {viewType === "bays" && (
          <div className="grid grid-cols-2 gap-4">
            {mockBays.map((bay) => (
              <motion.div
                key={bay.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border rounded-xl p-4 ${
                  bay.available
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-gray-900">{bay.name}</div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                    bay.available
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {bay.available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                {bay.currentJob && (
                  <div className="text-xs text-gray-700 bg-white rounded-lg p-2">
                    <div className="font-semibold mb-1">Current Job:</div>
                    <div>{bay.currentJob}</div>
                  </div>
                )}
                {bay.available && (
                  <div className="text-xs text-gray-600 mt-2">
                    Ready for next assignment
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {viewType === "mechanics" && (
          <div className="grid grid-cols-2 gap-4">
            {mockMechanics.map((mechanic) => (
              <motion.div
                key={mechanic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border rounded-xl p-4 ${
                  mechanic.available
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{mechanic.name}</div>
                    <div className="text-xs text-gray-600">{mechanic.specialty}</div>
                    <div className="text-xs text-amber-600 mt-1">★ {mechanic.rating}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                    mechanic.available
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {mechanic.available ? 'Available' : 'Busy'}
                  </span>
                </div>
                {mechanic.currentJob && (
                  <div className="text-xs text-gray-700 bg-white rounded-lg p-2">
                    <div className="font-semibold mb-1">Current Task:</div>
                    <div>{mechanic.currentJob}</div>
                  </div>
                )}
                {mechanic.available && (
                  <div className="text-xs text-gray-600 mt-2">
                    Ready for assignment
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
