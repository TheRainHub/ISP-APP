import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface RejectionModalProps {
  show: boolean;
  rejectionDraft: string;
  onClose: () => void;
  onSubmit: () => void;
  onDraftChange: (value: string) => void;
}

export function RejectionModal({
  show,
  rejectionDraft,
  onClose,
  onSubmit,
  onDraftChange,
}: RejectionModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-[500px] max-w-[90%]"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Request Changes</h3>
                <p className="text-sm text-gray-600">
                  Specify what information you need from the client
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Clarification Needed
              </label>
              <textarea
                value={rejectionDraft}
                onChange={(e) => onDraftChange(e.target.value)}
                placeholder="e.g., Please provide more details about when the grinding noise occurs..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={!rejectionDraft?.trim()}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send to Client
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
