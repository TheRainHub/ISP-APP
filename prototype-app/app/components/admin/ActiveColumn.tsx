import React from "react";
import { motion } from "framer-motion";
import { Wrench, AlertCircle, Send, Receipt } from "lucide-react";
import { AdditionalTask, OrderStatus } from "../../types";

interface ActiveColumnProps {
  orderStatus: OrderStatus;
  formData: {
    vehicle: string;
    vin: string;
  };
  additionalTasks: AdditionalTask[];
  workElapsedSeconds: number;
  intakePhotos: string[];
  onAdminSetPrice: (taskId: string, price: number) => void;
  onAdminSendToClient: (taskId: string) => void;
  selectedMechanics: string[];
}

export function ActiveColumn({
  orderStatus,
  formData,
  additionalTasks,
  workElapsedSeconds,
  intakePhotos,
  onAdminSetPrice,
  onAdminSendToClient,
  selectedMechanics,
}: ActiveColumnProps) {
  const tasksForAdmin = (additionalTasks || []).filter(t => t.sentToAdmin);
  const isActive = orderStatus === 'in_progress';

  return (
    <div className="flex-1 min-w-[320px]">
      <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
        Active Repair
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
          {isActive ? '1' : '0'}
        </span>
      </h4>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-l-4 border-l-red-500 border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-red-600" />
            <div className="font-bold text-gray-900">{formData.vehicle}</div>
          </div>
          <div className="text-[10px] text-gray-500 font-mono mb-3">{formData.vin}</div>

          {workElapsedSeconds >= 0 && (
            <div className="mb-4 bg-gray-900 p-3 rounded-lg border border-gray-800 flex items-center justify-between shadow-inner">
              <div className="flex flex-col">
                <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Live Repair Time</div>
                <div className="text-[10px] text-red-500 font-bold">In Progress</div>
              </div>
              <div className="text-xl font-mono font-bold text-white tracking-tighter">
                {Math.floor(workElapsedSeconds / 60)}:{(workElapsedSeconds % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}

          {selectedMechanics.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Mechanics on Duty</div>
              <div className="space-y-1.5">
                {selectedMechanics.map(id => (
                  <div key={id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="text-xs font-medium text-gray-700">{id === 'mech1' ? 'Nazar Sergeyev' : 'Petra Svobodová'}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase">Active</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {intakePhotos.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Live Intake Photos</div>
              <div className="grid grid-cols-4 gap-1.5">
                {intakePhotos.map((p, i) => (
                  <div key={i} className="aspect-square rounded border border-gray-200 overflow-hidden">
                    <img src={p} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {additionalTasks.length > 0 ? (
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Additional Tasks Status</div>
              {additionalTasks.map((task) => (
                <div key={task.id} className={`border rounded-lg p-3 ${task.approved ? 'bg-emerald-50 border-emerald-200' : task.declined ? 'bg-red-50 border-red-200 opacity-60' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-800 font-medium flex-1">{task.description}</p>
                    {task.approved && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded ml-2">APPROVED</span>}
                    {task.declined && <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded ml-2">DECLINED</span>}
                  </div>

                  {task.photos && task.photos.length > 0 && (
                    <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
                      {task.photos.map((p, i) => (
                        <img key={i} src={p} className="w-10 h-10 rounded border border-gray-200 object-cover shrink-0" />
                      ))}
                    </div>
                  )}

                  {task.sentToAdmin && (
                    <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                      <div className="text-[10px] font-bold text-amber-700 mb-1 flex items-center gap-1">
                         <AlertCircle className="w-3 h-3" /> Needs Pricing
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Receipt className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <input
                          type="number"
                          placeholder="Set Price (Kč)"
                          value={task.estimatedCost || ""}
                          onChange={(e) => onAdminSetPrice(task.id, parseFloat(e.target.value))}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <button
                        onClick={() => onAdminSendToClient(task.id)}
                        disabled={!task.estimatedCost}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold transition-all disabled:bg-gray-300"
                      >
                        Send to Client
                      </button>
                    </div>
                  )}

                  {task.sentToClient && !task.approved && !task.declined && (
                    <div className="mt-2 text-[10px] text-blue-600 font-bold bg-blue-50 p-1.5 rounded border border-blue-100 flex items-center gap-1">
                      <Send className="w-3 h-3" />
                      Awaiting client approval ({task.estimatedCost} Kč)
                    </div>
                  )}

                  {task.approved && (
                    <div className="text-[10px] text-emerald-700 font-bold">
                      Price: {task.estimatedCost} Kč · Added to invoice
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 py-4 text-center border-2 border-dashed border-gray-100 rounded-lg">
              No additional tasks reported
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
