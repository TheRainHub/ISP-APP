import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Clock } from "lucide-react";
import { TechWorkspace } from "./TechWorkspace";
import { AdditionalTaskModal } from "./AdditionalTaskModal";
import { MechanicLoginScreen } from "./MechanicLoginScreen";
import { MechanicSwitcher } from "./MechanicSwitcher";
import { WorkTimer } from "./WorkTimer";
import { AdditionalTask, OrderStatus, LoggedInMechanic } from "../../types";
import { mockMechanics } from "../../constants/mockData";

interface TechTabletAppProps {
  techTaskVisible: boolean;
  orderStatus: OrderStatus;
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
  };
  intakePhotosComplete: boolean;
  intakePhotos: string[];
  checksCompleted: number;
  additionalTasks: AdditionalTask[];
  showAdditionalTaskModal: boolean;
  additionalTaskDraft: string;
  additionalTaskCostDraft: string;
  opacity: string;
  loggedInMechanics: LoggedInMechanic[];
  currentMechanicView: string | null;
  selectedMechanics: string[];
  workStartTime: number | null;
  onIntakePhoto: () => void;
  onCompleteIntakePhotos: () => void;
  onTechCheck: () => void;
  onOpenAdditionalTaskModal: () => void;
  onCloseAdditionalTaskModal: () => void;
  onSubmitAdditionalTask: () => void;
  onTaskDraftChange: (value: string) => void;
  onCostDraftChange: (value: string) => void;
  onTechComplete: () => void;
  onMechanicLogin: (mechanicId: string) => void;
  onMechanicLogout: (mechanicId: string) => void;
  onSwitchMechanicView: (mechanicId: string | null) => void;
}

export function TechTabletApp({
  techTaskVisible,
  orderStatus,
  formData,
  intakePhotosComplete,
  intakePhotos,
  checksCompleted,
  additionalTasks,
  showAdditionalTaskModal,
  additionalTaskDraft,
  additionalTaskCostDraft,
  opacity,
  loggedInMechanics,
  currentMechanicView,
  selectedMechanics,
  workStartTime,
  onIntakePhoto,
  onCompleteIntakePhotos,
  onTechCheck,
  onOpenAdditionalTaskModal,
  onCloseAdditionalTaskModal,
  onSubmitAdditionalTask,
  onTaskDraftChange,
  onCostDraftChange,
  onTechComplete,
  onMechanicLogin,
  onMechanicLogout,
  onSwitchMechanicView,
}: TechTabletAppProps) {
  const hasLoggedInMechanics = loggedInMechanics?.length > 0;
  const currentMechanic = mockMechanics.find(m => m.id === currentMechanicView);
  const isAssignedToCurrentMechanic = currentMechanicView && selectedMechanics?.includes(currentMechanicView);
  const showWorkspace = techTaskVisible && (!currentMechanicView || isAssignedToCurrentMechanic);

  return (
    <div data-section="tech" className={`bg-white border border-gray-200 rounded-3xl flex flex-col relative shadow-xl transition-all duration-700 ${opacity} ${orderStatus === 'in_progress' ? 'flex-[4]' : 'flex-[2]'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 px-4 py-1 text-[10px] font-bold tracking-widest text-white rounded-b-lg uppercase">iPad Pro</div>

      {!hasLoggedInMechanics ? (
        <MechanicLoginScreen
          mechanics={mockMechanics}
          loggedInMechanics={loggedInMechanics}
          onLogin={onMechanicLogin}
        />
      ) : (
        <>
          <MechanicSwitcher
            mechanics={mockMechanics}
            loggedInMechanics={loggedInMechanics}
            currentMechanicView={currentMechanicView}
            onSwitch={onSwitchMechanicView}
            onLogout={onMechanicLogout}
          />

          <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
            <div className="text-sm font-medium text-gray-600">
              {currentMechanic ? `${currentMechanic.name} - Bay #2` : 'All Mechanics - Bay #2'}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${orderStatus === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
              {orderStatus === 'in_progress' ? 'In Progress' : 'Available'}
            </span>
          </div>

          <div className="flex-1 flex p-6 gap-6 overflow-hidden">
            <div className="flex-[2] flex flex-col justify-center relative">
              <AnimatePresence>
                {!showWorkspace && (
                  <motion.div exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <Wrench className="w-12 h-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-gray-600">
                      {currentMechanicView && !isAssignedToCurrentMechanic
                        ? 'No Tasks Assigned'
                        : 'No Active Tasks'}
                    </h3>
                    <p className="text-sm mt-2 text-gray-500">
                      {currentMechanicView && !isAssignedToCurrentMechanic
                        ? `${currentMechanic?.name} has no assigned tasks`
                        : 'Waiting for assignment from administrator'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showWorkspace && (
                  <TechWorkspace
                    formData={formData}
                    intakePhotosComplete={intakePhotosComplete}
                    intakePhotos={intakePhotos}
                    checksCompleted={checksCompleted}
                    additionalTasks={additionalTasks}
                    orderStatus={orderStatus}
                    onIntakePhoto={onIntakePhoto}
                    onCompleteIntakePhotos={onCompleteIntakePhotos}
                    onTechCheck={onTechCheck}
                    onOpenAdditionalTaskModal={onOpenAdditionalTaskModal}
                    onTechComplete={onTechComplete}
                  />
                )}
              </AnimatePresence>
            </div>

            {showWorkspace && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-5 shrink-0 space-y-4">
                <WorkTimer startTime={workStartTime} orderStatus={orderStatus} />

                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Information</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3"/>
                        Standard Time
                      </div>
                      <div className="font-semibold text-sm text-gray-900">1.5 labor hours</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Parts</div>
                      <div className="font-semibold text-sm text-emerald-700 bg-emerald-100 inline-block px-2 py-1 rounded">Issued from warehouse</div>
                    </div>
                    {currentMechanic && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Assigned Mechanic</div>
                        <div className="font-semibold text-sm text-gray-900">{currentMechanic.name}</div>
                        <div className="text-xs text-gray-600">{currentMechanic.specialty}</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <AdditionalTaskModal
            show={showAdditionalTaskModal}
            additionalTaskDraft={additionalTaskDraft}
            additionalTaskCostDraft={additionalTaskCostDraft}
            onClose={onCloseAdditionalTaskModal}
            onSubmit={onSubmitAdditionalTask}
            onTaskDraftChange={onTaskDraftChange}
            onCostDraftChange={onCostDraftChange}
          />
        </>
      )}
    </div>
  );
}
