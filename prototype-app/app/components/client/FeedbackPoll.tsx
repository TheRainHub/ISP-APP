import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, CheckCircle2, Sparkles } from "lucide-react";

export function FeedbackPoll() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mt-6">
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="poll"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900">Rate Our Service</h3>
              </div>
              
              <p className="text-sm text-gray-600">How was your experience today at Global Cars?</p>

              <div className="flex justify-between items-center py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hover || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-4 border-t border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Comments</span>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what we did well or what we can improve..."
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-300 resize-none shadow-inner"
                    rows={4}
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    Submit Review
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Thank You!</h4>
              <p className="text-sm text-gray-600">Your feedback helps us improve.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
