import React from "react";
import { motion } from "framer-motion";
import { Receipt, Download, Share2, CheckCircle2 } from "lucide-react";
import { AdditionalTask } from "../../types";

interface ReceiptViewProps {
  formData: {
    vehicle: string;
    vin: string;
  };
  additionalTasks?: AdditionalTask[];
  onClose?: () => void;
}

export function ReceiptView({ formData, additionalTasks = [] }: ReceiptViewProps) {
  const approvedTasks = additionalTasks.filter(t => t.approved);
  
  // Base price + parts + approved tasks
  const items = [
    { name: "Engine Diagnostics & Inspection", price: 1200 },
    { name: "Front Brake Pads (OEM)", price: 2800 },
    ...approvedTasks.map(t => ({ name: t.description, price: t.estimatedCost }))
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden max-w-md mx-auto"
    >
      <div className="bg-gray-900 p-6 text-white text-center relative">
        <div className="absolute top-4 left-4">
          <Receipt className="w-6 h-6 opacity-50" />
        </div>
        <h3 className="text-xl font-bold mb-1">Electronic Receipt</h3>
        <p className="text-xs opacity-60 uppercase tracking-widest font-semibold">Global Cars Service</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Vehicle</div>
            <div className="text-sm font-bold text-gray-900">{formData.vehicle}</div>
            <div className="text-[10px] text-gray-500 font-mono">{formData.vin}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Date</div>
            <div className="text-sm font-bold text-gray-900">May 11, 2026</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] text-gray-500 uppercase font-bold">Service Items</div>
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="text-gray-700">{item.name}</span>
              <span className="font-semibold text-gray-900">{item.price.toLocaleString()} Kč</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">{subtotal.toLocaleString()} Kč</span>
          </div>
          <div className="flex justify-between items-center text-sm text-emerald-600 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              10% discount for the 10th service visit
            </span>
            <span>-{discount.toLocaleString()} Kč</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-900">Total Paid</span>
            <span className="text-2xl font-black text-red-600">{total.toLocaleString()} Kč</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">Transaction ID: GC-88293-110526</p>
      </div>
    </motion.div>
  );
}
