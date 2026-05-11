import React from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { OrderStatus } from "../../types";

interface CompletedColumnProps {
  orderStatus: OrderStatus;
  formData: {
    vehicle: string;
    vin: string;
  };
  paymentSuccess: boolean;
  paymentInitiatedByAdvisor: boolean;
  onAdvisorInitiatePayment: () => void;
}

export function CompletedColumn({
  orderStatus,
  formData,
  paymentSuccess,
  paymentInitiatedByAdvisor,
  onAdvisorInitiatePayment,
}: CompletedColumnProps) {
  return (
    <div className="flex-1 min-w-[280px]">
      <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
        Completed
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
          {orderStatus === 'done' ? '1' : '0'}
        </span>
      </h4>
      {orderStatus === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-l-4 border-l-emerald-500 border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="font-bold mb-1 text-gray-900">{formData.vehicle} · {formData.vin}</div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase mb-3 inline-block">
            {paymentSuccess ? 'Paid' : paymentInitiatedByAdvisor ? 'Payment Sent' : 'Awaiting Payment'}
          </span>

          {!paymentInitiatedByAdvisor && !paymentSuccess && (
            <button
              onClick={onAdvisorInitiatePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <CreditCard className="w-4 h-4" />
              Send Payment Request
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
