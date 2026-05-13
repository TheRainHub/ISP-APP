"use client";

import React, { useState, useEffect } from "react";
import { useSystemState, useToast } from "./hooks";
import { Toast, Header } from "./components/shared";
import { ClientMobileApp } from "./components/client";
import { AdminWebApp } from "./components/admin";
import { TechTabletApp } from "./components/tech";
import { createHandlers } from "./utils/handlers";
import { getOpacity } from "./utils/helpers";

export default function PrototypePage() {
  const { state, setState, updateState, reset } = useSystemState();
  const { toast, showToast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let interval: any;
    if (state.orderStatus === "in_progress" && state.workStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.workStartTime) / 1000);
        // Only update if value changed to avoid redundant re-renders
        if (elapsed !== state.workElapsedSeconds) {
          updateState({ workElapsedSeconds: elapsed });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.orderStatus, state.workStartTime, state.workElapsedSeconds]);

  const handlers = createHandlers(state, updateState, showToast);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <Toast show={toast.show} msg={toast.msg} />

      <Header 
        step={state.step} 
        onReset={reset} 
        onPrevStep={handlers.handlePrevStep}
        onNextStep={handlers.handleNextStep}
        canGoNext={state.step < state.maxStepReached}
      />

      <main className="flex-1 flex gap-6 p-6 overflow-auto bg-gray-100">
        <ClientMobileApp
          clientView={state.clientView}
          formData={state.formData}
          formRejected={state.formRejected}
          rejectionComment={state.rejectionComment}
          clientHasNotif={state.clientHasNotif}
          step={state.step}
          orderStatus={state.orderStatus}
          appointmentNotif={state.appointmentNotif}
          appointmentConfirmed={state.appointmentConfirmed}
          availableSlots={state.availableSlots}
          selectedSlot={state.selectedSlot}
          additionalTasks={state.additionalTasks}
          paymentInitiatedByAdvisor={state.paymentInitiatedByAdvisor}
          paymentSuccess={state.paymentSuccess}
          showPayment={state.showPayment}
          vehiclePickedUp={state.vehiclePickedUp}
          partsOrdered={state.partsOrdered}
          requestDeclined={state.requestDeclined}
          opacity={getOpacity(state.focusedRole, "client", state.appointmentNotif, state.appointmentConfirmed)}
          isClient={isClient}
          onFormChange={handlers.handleFormChange}
          onPhotoUpload={handlers.handlePhotoUpload}
          onPhotoRemove={handlers.handlePhotoRemove}
          onSubmitRequest={handlers.handleSubmitRequest}
          onResubmitForm={handlers.handleResubmitForm}
          onClientReadNotif={handlers.handleClientReadNotif}
          onConfirmAppointment={handlers.handleConfirmAppointment}
          onDeclineAppointment={handlers.handleDeclineAppointment}
          onApproveAdditionalTask={handlers.handleApproveAdditionalTask}
          onDeclineAdditionalTask={handlers.handleDeclineAdditionalTask}
          onSuggestSlots={handlers.handleSuggestSlots}
          onOrderParts={handlers.handleOrderParts}
          onPayment={handlers.handlePayment}
          onPickUpVehicle={handlers.handlePickUpVehicle}
          onSelectSlot={handlers.handleSelectSlot}
        />

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <AdminWebApp
            state={state}
            opacity={getOpacity(state.focusedRole, "admin", state.appointmentNotif, state.appointmentConfirmed)}
            onViewChange={(view) => updateState({ adminView: view })}
            onTechReview={handlers.handleTechReview}
            onOpenRejectionModal={() => updateState({ showRejectionModal: true })}
            onDeclineRequest={handlers.handleDeclineRequest}
            onCloseRejectionModal={() => updateState({ showRejectionModal: false, rejectionDraft: "" })}
            onSubmitRejection={() => {
              if (state.rejectionDraft.trim()) {
                handlers.handleRejectForm(state.rejectionDraft);
              }
            }}
            onRejectionDraftChange={(value) => updateState({ rejectionDraft: value })}
            onCheckParts={handlers.handleCheckParts}
            onSelectSlot={handlers.handleSelectSlot}
            onConfirmSlot={handlers.handleConfirmSlot}
            onAdminSend={handlers.handleAdminSend}
            onAdvisorInitiatePayment={handlers.handleAdvisorInitiatePayment}
            onUpdateState={updateState}
            onAdminSetTaskPrice={handlers.handleAdminSetTaskPrice}
            onAdminSendTaskToClient={handlers.handleAdminSendTaskToClient}
            onSuggestSlots={handlers.handleSuggestSlots}
            onOrderParts={handlers.handleOrderParts}
          />

          <TechTabletApp
            techTaskVisible={state.techTaskVisible}
            orderStatus={state.orderStatus}
            formData={state.formData}
            intakePhotosComplete={state.intakePhotosComplete}
            intakePhotos={state.intakePhotos}
            checksCompleted={state.checksCompleted}
            additionalTasks={state.additionalTasks}
            showAdditionalTaskModal={state.showAdditionalTaskModal}
            additionalTaskDraft={state.additionalTaskDraft}
            opacity={getOpacity(state.focusedRole, "tech", state.appointmentNotif, state.appointmentConfirmed)}
            loggedInMechanics={state.loggedInMechanics}
            currentMechanicView={state.currentMechanicView}
            selectedMechanics={state.selectedMechanics}
            workStartTime={state.workStartTime}
            additionalTaskPhotosDraft={state.additionalTaskPhotosDraft}
            onIntakePhoto={handlers.handleIntakePhoto}
            onCompleteIntakePhotos={handlers.handleCompleteIntakePhotos}
            onTechCheck={handlers.handleTechCheck}
            onOpenAdditionalTaskModal={() => updateState({ showAdditionalTaskModal: true })}
            onCloseAdditionalTaskModal={() => updateState({
              showAdditionalTaskModal: false,
              additionalTaskDraft: "",
              additionalTaskPhotosDraft: []
            })}
            onSubmitAdditionalTask={handlers.handleSubmitAdditionalTask}
            onTaskDraftChange={(value) => updateState({ additionalTaskDraft: value })}
            onAdditionalTaskPhoto={handlers.handleAdditionalTaskPhoto}
            onTechComplete={handlers.handleTechComplete}
            onMechanicLogin={handlers.handleMechanicLogin}
            onMechanicLogout={handlers.handleMechanicLogout}
            onSwitchMechanicView={handlers.handleSwitchMechanicView}
          />
        </div>
      </main>
    </div>
  );
}
