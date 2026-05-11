import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { FormView } from "./FormView";
import { TrackingView } from "./TrackingView";
import { ClientView, AdditionalTask, TimeSlot, OrderStatus } from "../../types";

interface ClientMobileAppProps {
  clientView: ClientView;
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
    photos: string[];
    selectedServices: string[];
  };
  formRejected: boolean;
  rejectionComment: string;
  clientHasNotif: boolean;
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
  opacity: string;
  isClient: boolean;
  onFormChange: (field: string, value: string | string[]) => void;
  onPhotoUpload: () => void;
  onPhotoRemove: (idx: number) => void;
  onSubmitRequest: () => void;
  onResubmitForm: () => void;
  onClientReadNotif: () => void;
  onConfirmAppointment: () => void;
  onDeclineAppointment: () => void;
  onApproveAdditionalTask: (taskId: string) => void;
  onDeclineAdditionalTask: (taskId: string) => void;
  onPayment: () => void;
  onPickUpVehicle: () => void;
  onSelectSlot: (slotId: string) => void;
}

export function ClientMobileApp({
  clientView,
  formData,
  formRejected,
  rejectionComment,
  clientHasNotif,
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
  opacity,
  isClient,
  onFormChange,
  onPhotoUpload,
  onPhotoRemove,
  onSubmitRequest,
  onResubmitForm,
  onClientReadNotif,
  onConfirmAppointment,
  onDeclineAppointment,
  onApproveAdditionalTask,
  onDeclineAdditionalTask,
  onPayment,
  onPickUpVehicle,
  onSelectSlot,
}: ClientMobileAppProps) {
  return (
    <div className={`w-[400px] shrink-0 bg-white border border-gray-200 rounded-[2rem] flex flex-col relative shadow-xl transition-opacity duration-500 ${opacity}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 px-4 py-1 text-[10px] font-bold tracking-widest text-white rounded-b-lg uppercase">iOS App</div>

      <div className="p-6 pt-10 border-b border-gray-100 flex justify-between items-center shrink-0">
        <div className="font-bold text-lg flex items-center gap-2 text-gray-900">
          <Settings className="w-5 h-5 text-red-600"/>
          GlobalCars
        </div>
        <div className="relative cursor-pointer" onClick={onClientReadNotif}>
          <Bell className="w-6 h-6 text-gray-700" />
          <AnimatePresence>
            {clientHasNotif && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto flex flex-col">
        {clientView === 'form' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FormView
              formData={formData}
              formRejected={formRejected}
              rejectionComment={rejectionComment}
              isClient={isClient}
              onFormChange={onFormChange}
              onPhotoUpload={onPhotoUpload}
              onPhotoRemove={onPhotoRemove}
              onSubmitRequest={onSubmitRequest}
              onResubmitForm={onResubmitForm}
            />
          </motion.div>
        )}

        {clientView === 'tracking' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TrackingView
              formData={formData}
              step={step}
              orderStatus={orderStatus}
              appointmentNotif={appointmentNotif}
              appointmentConfirmed={appointmentConfirmed}
              availableSlots={availableSlots}
              selectedSlot={selectedSlot}
              additionalTasks={additionalTasks}
              paymentInitiatedByAdvisor={paymentInitiatedByAdvisor}
              paymentSuccess={paymentSuccess}
              showPayment={showPayment}
              vehiclePickedUp={vehiclePickedUp}
              partsOrdered={partsOrdered}
              onConfirmAppointment={onConfirmAppointment}
              onDeclineAppointment={onDeclineAppointment}
              onApproveAdditionalTask={onApproveAdditionalTask}
              onDeclineAdditionalTask={onDeclineAdditionalTask}
              onPayment={onPayment}
              onPickUpVehicle={onPickUpVehicle}
              onSelectSlot={onSelectSlot}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
