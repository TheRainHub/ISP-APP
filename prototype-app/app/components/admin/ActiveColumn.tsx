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
  onAdminSetPrice: (taskId: string, price: number) => void;
  onAdminSendToClient: (taskId: string) => void;
}

export function ActiveColumn({
  orderStatus,
  formData,
  additionalTasks,
  onAdminSetPrice,
  onAdminSendToClient,
}: ActiveColumnProps) {
  const tasksForAdmin = (additionalTasks || []).filter(t => t.sentToAdmin);
  const isActive = orderStatus === 'in_progress';

  return (
    <div className="flex-1 min-w-[320px]">
      <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
        Active / In repair / In progress
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

          {tasksForAdmin.length > 0 ? (
            <div className="space-y-3">
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <AlertCircle className="w-3.5 h-3.5" />
                Additional Tasks Needing Pricing
              </div>
              {tasksForAdmin.map((task) => (
                <div key={task.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-800 mb-3 font-medium">{task.description}</p>
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Receipt className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <input
                        type="number"
                        placeholder="Assign Price (Kč)"
                        value={task.estimatedCost || ""}
                        onChange={(e) => onAdminSetPrice(task.id, parseFloat(e.target.value))}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <button
                      onClick={() => onAdminSendToClient(task.id)}
                      disabled={!task.estimatedCost}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3 h-3" />
                      Send to Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 py-4 text-center border-2 border-dashed border-gray-100 rounded-lg">
              No pending tasks to review
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
