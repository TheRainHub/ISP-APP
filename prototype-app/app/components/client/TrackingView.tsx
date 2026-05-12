import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle, AlertCircle, CreditCard, Car, Sparkles } from "lucide-react";
import { AdditionalTask, TimeSlot, OrderStatus } from "../../types";
import { SlotPicker } from "./SlotPicker";
import { ReceiptView } from "./ReceiptView";
import { FeedbackPoll } from "./FeedbackPoll";

interface TrackingViewProps {
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
  };
  step: number;
  orderStatus: OrderStatus;
  appointmentNotif: boolean;
  appointmentConfirmed: boolean;
  availableSlots: TimeSlot[];
  selectedSlot: string | null;
  additionalTasks: AdditionalTask[];
  paymentInitiatedByAdvisor: boolean;
  paymentSuccess: boolean;
  showPayment: boolean;
  vehiclePickedUp: boolean;
  partsOrdered: boolean;
  onConfirmAppointment: () => void;
  onDeclineAppointment: () => void;
  onApproveAdditionalTask: (taskId: string) => void;
  onDeclineAdditionalTask: (taskId: string) => void;
  onPayment: () => void;
  onPickUpVehicle: () => void;
  onSelectSlot: (slotId: string) => void;
}

export function TrackingView({
  formData,
  step,
  orderStatus,
  appointmentNotif,
  appointmentConfirmed,
  availableSlots,
  selectedSlot,
  additionalTasks,
  paymentInitiatedByAdvisor,
  paymentSuccess,
  showPayment,
  vehiclePickedUp,
  partsOrdered,
  onConfirmAppointment,
  onDeclineAppointment,
  onApproveAdditionalTask,
  onDeclineAdditionalTask,
  onPayment,
  onPickUpVehicle,
  onSelectSlot,
}: TrackingViewProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">{formData.vehicle} ({formData.vin})</h3>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 relative z-0">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs text-gray-500 font-medium">Order Status</span>
          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
            orderStatus === 'new' ? 'bg-amber-100 text-amber-700' : 
            orderStatus === 'accepted' ? 'bg-blue-100 text-blue-700' : 
            orderStatus === 'in_progress' ? 'bg-amber-100 text-amber-700' : 
            paymentSuccess ? 'bg-emerald-500 text-white shadow-sm' : 
            'bg-emerald-100 text-emerald-700'
          }`}>
            {orderStatus === 'new' ? 'Pending' : 
             orderStatus === 'accepted' ? 'Accepted' : 
             orderStatus === 'in_progress' ? 'In Progress' : 
             paymentSuccess ? 'Paid / Ready' : 'Done'}
          </span>
        </div>

        <div className="relative pl-3 border-l-2 border-gray-200 space-y-6">
          <div className={`relative transition-opacity ${step >= 0 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${step >= 1 ? 'bg-emerald-600' : 'bg-amber-500 ring-4 ring-amber-100'}`} />
            <div className="text-sm font-semibold text-gray-900">Request Created</div>
            <div className="text-xs text-gray-500 mt-1">{formData.issue}</div>
          </div>

          {step >= 1 && (
            <div className={`relative transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-blue-500 ring-4 ring-blue-100'}`} />
              <div className="text-sm font-semibold text-gray-900">Appointment Scheduled</div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedSlot && availableSlots.find(s => s.id === selectedSlot)
                  ? `${availableSlots.find(s => s.id === selectedSlot)?.date} at ${availableSlots.find(s => s.id === selectedSlot)?.time}`
                  : 'Time slot confirmed'}
              </div>
            </div>
          )}

          <div className={`relative transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${step >= 3 ? 'bg-emerald-600' : step === 2 ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-gray-300'}`} />
            <div className="text-sm font-semibold text-gray-900">In Progress</div>
            <div className="text-xs text-gray-500 mt-1">Vehicle in repair bay</div>
          </div>

          <div className={`relative transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${paymentSuccess ? 'bg-emerald-600' : (orderStatus === 'done' && !paymentSuccess) ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-gray-300'}`} />
            <div className="text-sm font-semibold text-gray-900">Payment</div>
            <div className="text-xs text-gray-500 mt-1">
              {paymentSuccess ? 'Payment confirmed via Apple Pay' : 'Waiting for payment confirmation'}
            </div>
          </div>

          <div className={`relative transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${vehiclePickedUp ? 'bg-emerald-600' : (paymentSuccess && !vehiclePickedUp) ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-gray-300'}`} />
            <div className="text-sm font-semibold text-gray-900">Ready for Pickup</div>
            <div className="text-xs text-gray-500 mt-1">
              {vehiclePickedUp ? 'Vehicle has been picked up' : 'Your car is waiting at the service bay'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <AnimatePresence>
          {availableSlots.length > 0 && !appointmentConfirmed && (
            <SlotPicker
              key="slot-picker"
              availableSlots={availableSlots}
              selectedSlot={selectedSlot}
              partsOrdered={partsOrdered}
              onSelectSlot={onSelectSlot}
              onConfirmSlot={onConfirmAppointment}
            />
          )}

          {appointmentConfirmed && selectedSlot && (
            <motion.div
              key="appointment-confirmed"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm mb-4"
            >
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">✓ Appointment Confirmed</div>
                  <div className="text-xs text-gray-700 mb-1">
                    {availableSlots.find(s => s.id === selectedSlot)?.date}
                  </div>
                  <div className="text-xs text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {availableSlots.find(s => s.id === selectedSlot)?.time}
                  </div>
                  <div className="text-xs text-emerald-700 mt-2 font-semibold">
                    Waiting for service advisor confirmation
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {additionalTasks.filter(t => t.sentToClient && !t.approved && !t.declined).map(task => (
            <motion.div
              key={task.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm mb-4"
            >
              <div className="flex gap-3 items-start mb-3">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 mb-1">Additional Issue Found</div>
                  <p className="text-xs text-gray-700 mb-2">{task.description}</p>
                  <div className="text-sm font-bold text-amber-900">
                    Estimated Cost: {task.estimatedCost} Kč
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-3">
                Would you like to proceed with this repair?
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onApproveAdditionalTask(task.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => onDeclineAdditionalTask(task.id)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-xs font-bold transition-all"
                >
                  ✗ Decline
                </button>
              </div>
            </motion.div>
          ))}

          {orderStatus === 'done' && paymentInitiatedByAdvisor && !paymentSuccess && (
            <motion.div
              key="payment-pending"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm mb-4"
            >
              <div className="flex gap-4 items-center mb-3">
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-gray-900">Repair Completed!</div>
                  <div className="text-xs text-gray-600 mt-1">Brake pads replaced</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 mb-3 shadow-inner">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 border-b border-gray-50 pb-2">Service Breakdown</div>
                {(() => {
                  const approvedTasks = additionalTasks.filter(t => t.approved);
                  const items = [
                    { name: "Engine Diagnostics & Inspection", price: 1200 },
                    { name: "Front Brake Pads (OEM)", price: 2800 },
                    ...approvedTasks.map(t => ({ name: t.description, price: t.estimatedCost || 0 }))
                  ];
                  
                  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
                  const discount = Math.round(subtotal * 0.1);
                  const total = subtotal - discount;

                  return (
                    <>
                      <div className="space-y-2 mb-4">
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.price.toLocaleString()} Kč</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-dashed border-gray-200 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-bold text-gray-900">{subtotal.toLocaleString()} Kč</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-600 font-bold">
                          <span className="text-xs">10% Loyalty Discount</span>
                          <span className="text-sm">-{discount.toLocaleString()} Kč</span>
                        </div>
                        <div className="border-t-2 border-gray-900 mt-2 pt-2 flex justify-between items-center">
                          <span className="text-sm font-black text-gray-900 uppercase">Total to Pay</span>
                          <span className="text-xl font-black text-red-600">{total.toLocaleString()} Kč</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={onPayment}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay with Apple Pay
              </button>
            </motion.div>
          )}

          {orderStatus === 'done' && showPayment && (
            <motion.div
              key="payment-processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg mb-4"
            >
              {!paymentSuccess ? (
                <div className="text-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <CreditCard className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                  <p className="text-sm text-gray-600 mb-4">Please wait...</p>
                  <div className="flex justify-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-red-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-red-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-red-600 rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12, delay: 0.3 }}
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                  </motion.div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-bold text-gray-900 mb-2"
                  >
                    Payment Successful!
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-gray-600"
                  >
                    {(() => {
                      const approvedTasks = additionalTasks.filter(t => t.approved);
                      const items = [
                        { name: "Engine Diagnostics & Inspection", price: 1200 },
                        { name: "Front Brake Pads (OEM)", price: 2800 },
                        ...approvedTasks.map(t => ({ name: t.description, price: t.estimatedCost || 0 }))
                      ];
                      const subtotal = items.reduce((sum, item) => sum + item.price, 0);
                      const discount = Math.round(subtotal * 0.1);
                      const total = subtotal - discount;
                      return `${total.toLocaleString()} Kč paid`;
                    })()}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}

          {orderStatus === 'done' && paymentSuccess && !showPayment && !vehiclePickedUp && (
            <motion.div
              key="thank-you-pickup"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-6 shadow-sm text-center mb-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-sm text-gray-700 mb-1">We appreciate your trust in GlobalCars</p>
              <p className="text-xs text-gray-600 mb-4">Drive safely and see you next time!</p>
              <button
                onClick={onPickUpVehicle}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Car className="w-5 h-5" />
                Pick Up Vehicle
              </button>
            </motion.div>
          )}

          {vehiclePickedUp && (
            <div key="order-completed-summary" className="space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Completed!</h3>
                <p className="text-sm text-gray-700 mb-1">Your {formData.vehicle} is ready</p>
                <p className="text-xs text-gray-600">Safe travels! 🚗</p>
              </motion.div>

              <ReceiptView 
                formData={formData}
                additionalTasks={additionalTasks}
              />

              <FeedbackPoll />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
