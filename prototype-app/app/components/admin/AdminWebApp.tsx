import React from "react";
import { Users, LayoutDashboard, Calendar, Car } from "lucide-react";
import { AdminView, SystemState } from "../../types";
import { mockClients } from "../../constants/mockData";
import { IncomingColumn } from "./IncomingColumn";
import { PartsReviewColumn } from "./PartsReviewColumn";
import { ScheduleColumn } from "./ScheduleColumn";
import { ScheduledColumn } from "./ScheduledColumn";
import { ActiveColumn } from "./ActiveColumn";
import { CompletedColumn } from "./CompletedColumn";
import { ScheduleView } from "./ScheduleView";
import { ClientsView } from "./ClientsView";
import { RejectionModal } from "./RejectionModal";

interface AdminWebAppProps {
  state: SystemState;
  opacity: string;
  onViewChange: (view: AdminView) => void;
  onTechReview: () => void;
  onOpenRejectionModal: () => void;
  onCloseRejectionModal: () => void;
  onSubmitRejection: () => void;
  onRejectionDraftChange: (value: string) => void;
  onCheckParts: () => void;
  onSelectSlot: (slotId: string) => void;
  onConfirmSlot: () => void;
  onAdminSend: () => void;
  onAdvisorInitiatePayment: () => void;
  onUpdateState: (updates: Partial<SystemState>) => void;
  onAdminSetTaskPrice: (taskId: string, price: number) => void;
  onAdminSendTaskToClient: (taskId: string) => void;
}

export function AdminWebApp({
  state,
  opacity,
  onViewChange,
  onTechReview,
  onOpenRejectionModal,
  onCloseRejectionModal,
  onSubmitRejection,
  onRejectionDraftChange,
  onCheckParts,
  onSelectSlot,
  onConfirmSlot,
  onAdminSend,
  onAdvisorInitiatePayment,
  onUpdateState,
  onAdminSetTaskPrice,
  onAdminSendTaskToClient,
}: AdminWebAppProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-3xl flex flex-col relative shadow-xl transition-all duration-700 ${opacity} ${state.orderStatus === 'in_progress' ? 'flex-[1]' : 'flex-[3]'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 px-4 py-1 text-[10px] font-bold tracking-widest text-white rounded-b-lg uppercase">Web CRM</div>

      <div className="p-4 pt-6 border-b border-gray-100 flex justify-between items-center shrink-0">
        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Users className="w-4 h-4"/>
          Service Advisor
        </div>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Shift Active</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-48 border-r border-gray-100 p-4 space-y-2 shrink-0 bg-gray-50">
          <div
            onClick={() => onViewChange('requests')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${state.adminView === 'requests' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <LayoutDashboard className="w-4 h-4"/>
            Requests
          </div>
          <div
            onClick={() => onViewChange('schedule')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${state.adminView === 'schedule' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Calendar className="w-4 h-4"/>
            Schedule
          </div>
          <div
            onClick={() => onViewChange('clients')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${state.adminView === 'clients' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Car className="w-4 h-4"/>
            Clients
          </div>
        </div>

        {state.adminView === 'requests' && (
          <div className="flex-1 p-6 flex gap-6 overflow-x-auto">
            <IncomingColumn
              clientView={state.clientView}
              orderStatus={state.orderStatus}
              formData={state.formData}
              onTechReview={onTechReview}
              onOpenRejectionModal={onOpenRejectionModal}
              onClientClick={(name) => {
                const client = mockClients.find(c => c.name === name);
                if (client) {
                  onUpdateState({ 
                    adminView: 'clients',
                    selectedClientId: client.id 
                  });
                }
              }}
            />

            <PartsReviewColumn
              requiredParts={state.requiredParts}
              resourcesAllocated={state.resourcesAllocated}
              selectedBay={state.selectedBay}
              selectedMechanics={state.selectedMechanics}
              partsOrdered={state.partsOrdered}
              availableSlots={state.availableSlots}
              onCheckParts={onCheckParts}
            />

            <ScheduleColumn
              availableSlots={state.availableSlots}
              selectedSlot={state.selectedSlot}
              partsOrdered={state.partsOrdered}
              offeredSlots={state.offeredSlots}
              appointmentConfirmed={state.appointmentConfirmed}
              onSelectSlot={onSelectSlot}
              onConfirmSlot={onConfirmSlot}
            />

            <ScheduledColumn
              orderStatus={state.orderStatus}
              selectedSlot={state.selectedSlot}
              availableSlots={state.availableSlots}
              formData={state.formData}
              appointmentConfirmed={state.appointmentConfirmed}
              onAdminSend={onAdminSend}
            />

            <ActiveColumn
              orderStatus={state.orderStatus}
              formData={state.formData}
              additionalTasks={state.additionalTasks}
              onAdminSetPrice={onAdminSetTaskPrice}
              onAdminSendToClient={onAdminSendTaskToClient}
            />

            <CompletedColumn
              orderStatus={state.orderStatus}
              formData={state.formData}
              paymentSuccess={state.paymentSuccess}
              paymentInitiatedByAdvisor={state.paymentInitiatedByAdvisor}
              onAdvisorInitiatePayment={onAdvisorInitiatePayment}
            />
          </div>
        )}

        {state.adminView === 'schedule' && <ScheduleView />}
        {state.adminView === 'clients' && (
          <ClientsView 
            initialSelectedClientId={state.selectedClientId}
            onClientSelect={(id) => onUpdateState({ selectedClientId: id })}
            onBackToDashboard={() => onUpdateState({ adminView: 'requests', selectedClientId: null })}
          />
        )}
      </div>

      <RejectionModal
        show={state.showRejectionModal}
        rejectionDraft={state.rejectionDraft}
        onClose={onCloseRejectionModal}
        onSubmit={onSubmitRejection}
        onDraftChange={onRejectionDraftChange}
      />
    </div>
  );
}
