import { SystemState, AdditionalTask } from "../types";
import { mockParts, mockTimeSlots, mockBays, mockMechanics } from "../constants/mockData";

export function createHandlers(
  state: SystemState,
  updateState: (updates: Partial<SystemState>) => void,
  showToast: (msg: string, duration?: number) => void
) {
  const setState = updateState;

  return {
    handleFormChange: (field: string, value: string | string[]) => {
      setState({
        formData: { ...state.formData, [field]: value }
      });
    },

    handlePhotoUpload: () => {
      const photoUrl = `https://via.placeholder.com/400x300?text=Photo+${state.formData.photos.length + 1}`;
      setState({
        formData: {
          ...state.formData,
          photos: [...state.formData.photos, photoUrl]
        }
      });
      showToast("Photo uploaded successfully", 2000);
    },

    handlePhotoRemove: (idx: number) => {
      setState({
        formData: {
          ...state.formData,
          photos: state.formData.photos.filter((_, i) => i !== idx)
        }
      });
    },

    handleSubmitRequest: () => {
      setState({
        clientView: "tracking",
        orderStatus: "new",
        step: 0,
      });
      showToast("Request submitted - waiting for technician review");
    },

    handleTechReview: () => {
      const availableBay = mockBays.find(b => b.available);
      const availableMechanics = mockMechanics.filter(m => m.available);
      const selectedMechs = state.formData.selectedServices.length > 0
        ? availableMechanics.slice(0, Math.min(2, availableMechanics.length)).map(m => m.id)
        : availableMechanics.slice(0, 1).map(m => m.id);

      setState({
        requiredParts: mockParts,
        focusedRole: "admin",
        selectedBay: availableBay?.id || null,
        selectedMechanics: selectedMechs,
        resourcesAllocated: true,
      });
      showToast("Technician reviewing - resources allocated");
    },

    handleCheckParts: () => {
      const unavailableParts = state.requiredParts.filter(p => !p.available);
      if (unavailableParts.length > 0) {
        // Если детали нужно заказать, показываем слоты после даты доставки
        const slotsAfterDelivery = mockTimeSlots.filter(s => s.date >= "2026-05-11" && s.available);

        setState({
          partsOrdered: true,
          offeredSlots: slotsAfterDelivery,
          availableSlots: slotsAfterDelivery,
          focusedRole: "client",
          clientHasNotif: true,
        });
        showToast(`Ordering ${unavailableParts.length} parts from factory - ${slotsAfterDelivery.length} slots available after delivery`);
      } else {
        // Все детали в наличии, показываем все доступные слоты
        const availableSlots = mockTimeSlots.filter(s => s.available);

        setState({
          offeredSlots: availableSlots,
          availableSlots: availableSlots,
          focusedRole: "client",
          clientHasNotif: true,
        });
        showToast(`All parts available - ${availableSlots.length} slots available for booking`);
      }
    },

    handleSelectSlot: (slotId: string) => {
      setState({ selectedSlot: slotId });
    },

    handleConfirmSlot: () => {
      const slot = state.availableSlots.find(s => s.id === state.selectedSlot);
      setState({
        orderStatus: "accepted",
        step: 1,
        appointmentConfirmed: true,
        focusedRole: "admin",
      });
      showToast(`✓ Appointment confirmed for ${slot?.date} at ${slot?.time}`);
    },

    handleConfirmAppointment: () => {
      const slot = state.availableSlots.find(s => s.id === state.selectedSlot);
      setState({
        appointmentNotif: false,
        clientHasNotif: false,
        focusedRole: "admin",
      });
      showToast(`Client selected ${slot?.date} at ${slot?.time} - waiting for confirmation`);
    },

    handleDeclineAppointment: () => {
      setState({
        appointmentNotif: false,
        selectedSlot: null,
        orderStatus: "new",
        step: 0,
      });
      showToast("Client declined appointment - select new time");
    },

    handleRejectForm: (comment: string) => {
      setState({
        formRejected: true,
        rejectionComment: comment,
        clientHasNotif: true,
        clientView: "form",
        orderStatus: "new",
        focusedRole: "client",
        showRejectionModal: false,
        rejectionDraft: "",
      });
      showToast("Form rejected - sent back to client with comments");
    },

    handleResubmitForm: () => {
      setState({
        formRejected: false,
        rejectionComment: "",
        clientView: "tracking",
        clientHasNotif: false,
        focusedRole: "admin",
      });
      showToast("Form resubmitted after changes");
    },

    handleAdminSend: () => {
      setState({
        orderStatus: "in_progress",
        step: 2,
        techTaskVisible: true,
        focusedRole: "tech",
        clientView: "tracking",
        workStartTime: Date.now(),
        workElapsedSeconds: 0,
      });
      showToast("Figma: Set Variable orderStatus = 'in_progress'");

      setTimeout(() => {
        const techSection = document.querySelector('[data-section="tech"]');
        if (techSection) {
          techSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    },

    handleIntakePhoto: () => {
      const photoUrl = `https://via.placeholder.com/400x300?text=Intake+Photo+${state.intakePhotos.length + 1}`;
      setState({
        intakePhotos: [...state.intakePhotos, photoUrl]
      });
      showToast("Intake photo captured");
    },

    handleCompleteIntakePhotos: () => {
      setState({
        intakePhotosComplete: true
      });
      showToast("Intake photos completed");
    },

    handleSubmitAdditionalTask: () => {
      if (state.additionalTaskDraft.trim() && state.additionalTaskCostDraft.trim()) {
        const newTask: AdditionalTask = {
          id: `task-${Date.now()}`,
          description: state.additionalTaskDraft,
          estimatedCost: parseFloat(state.additionalTaskCostDraft),
          approved: false,
          declined: false,
        };
        setState({
          additionalTasks: [...state.additionalTasks, newTask],
          showAdditionalTaskModal: false,
          additionalTaskDraft: "",
          additionalTaskCostDraft: "",
          clientHasNotif: true,
          focusedRole: "client",
        });
        showToast("Additional task sent to client for approval");
      }
    },

    handleApproveAdditionalTask: (taskId: string) => {
      setState({
        additionalTasks: state.additionalTasks.map(t =>
          t.id === taskId ? { ...t, approved: true } : t
        ),
        focusedRole: "tech",
      });
      showToast("Additional task approved by client");
    },

    handleDeclineAdditionalTask: (taskId: string) => {
      setState({
        additionalTasks: state.additionalTasks.map(t =>
          t.id === taskId ? { ...t, declined: true } : t
        ),
        focusedRole: "tech",
      });
      showToast("Additional task declined by client");
    },

    handleTechCheck: () => {
      const totalTasks = 2 + state.additionalTasks.filter(t => t.approved).length;
      if (state.checksCompleted < totalTasks) {
        setState({ checksCompleted: state.checksCompleted + 1 });
        showToast("Figma: Variant Checkbox = 'Checked'");
      }
    },

    handleTechComplete: () => {
      setState({
        orderStatus: "done",
        step: 3,
        clientHasNotif: true,
        focusedRole: "all"
      });
      showToast("Figma: Set Variable orderStatus = 'done'");
    },

    handleClientReadNotif: () => {
      setState({ clientHasNotif: false });
      showToast("Figma: Set Variable clientHasNotif = false");
    },

    handlePayment: () => {
      setState({ showPayment: true });

      setTimeout(() => {
        setState({ paymentSuccess: true });

        setTimeout(() => {
          setState({
            showPayment: false,
            clientHasNotif: false
          });
        }, 2000);
      }, 1500);
    },

    handleAdvisorInitiatePayment: () => {
      setState({
        paymentInitiatedByAdvisor: true,
        clientHasNotif: true,
        focusedRole: "client",
      });
      showToast("Service Advisor initiated payment - sent to client");
    },

    handlePickUpVehicle: () => {
      setState({
        vehiclePickedUp: true,
        step: 4,
      });
      showToast("Vehicle picked up - order completed!");
    },

    handleMechanicLogin: (mechanicId: string) => {
      const alreadyLoggedIn = state.loggedInMechanics.some(m => m.mechanicId === mechanicId);
      if (!alreadyLoggedIn) {
        setState({
          loggedInMechanics: [
            ...state.loggedInMechanics,
            { mechanicId, loginTime: new Date().toISOString() }
          ],
          currentMechanicView: mechanicId,
        });
        showToast("Mechanic logged in successfully");
      }
    },

    handleMechanicLogout: (mechanicId: string) => {
      setState({
        loggedInMechanics: state.loggedInMechanics.filter(m => m.mechanicId !== mechanicId),
        currentMechanicView: state.currentMechanicView === mechanicId ? null : state.currentMechanicView,
      });
      showToast("Mechanic logged out");
    },

    handleSwitchMechanicView: (mechanicId: string | null) => {
      setState({ currentMechanicView: mechanicId });
    },
  };
}
