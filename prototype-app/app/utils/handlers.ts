import { SystemState, AdditionalTask } from "../types";
import { mockParts, mockTimeSlots, mockBays, mockMechanics } from "../constants/mockData";

export function createHandlers(
  state: SystemState,
  updateState: (updates: Partial<SystemState>) => void,
  showToast: (msg: string, duration?: number) => void
) {
  const setState = updateState;

  return {
    handleFormChange: (field: string, value: string | string[] | boolean) => {
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
        maxStepReached: 0,
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
        techTaskVisible: false,
        // orderStatus остается "new", чтобы не прыгать в Scheduled преждевременно
      });
      showToast("Request accepted - moving to parts and scheduling");
    },

    handleCheckParts: () => {
      const unavailableParts = state.requiredParts.filter(p => !p.available);
      if (unavailableParts.length > 0) {
        // Если детали нужно заказать, показываем слоты после даты доставки (14 + 2 дня эстимейт = 17 число)
        const slotsAfterDelivery = mockTimeSlots.filter(s => s.date >= "2026-05-17" && s.available);

        setState({
          partsOrdered: true,
          offeredSlots: slotsAfterDelivery,
          availableSlots: slotsAfterDelivery,
          focusedRole: "client",
          clientHasNotif: true,
          appointmentNotif: true,
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
          appointmentNotif: true,
        });
        showToast(`All parts available - ${availableSlots.length} slots available for booking`);
      }
    },

    handleSelectSlot: (slotId: string) => {
      setState({ selectedSlot: slotId });
    },

    handleSuggestSlots: () => {
      const unavailableParts = state.requiredParts.filter(p => !p.available);
      const minDate = unavailableParts.length > 0 ? "2026-05-17" : "2026-05-14";
      
      const availableSlots = mockTimeSlots.filter(s => s.date >= minDate && s.available);
      
      setState({
        slotsSuggested: true,
        offeredSlots: availableSlots,
        availableSlots: availableSlots,
        focusedRole: "client",
        clientHasNotif: true,
        appointmentNotif: true,
      });
      showToast(unavailableParts.length > 0 
        ? `Suggested slots from ${minDate} (considering parts ETA)` 
        : "Time slots suggested to client");
    },

    handleOrderParts: () => {
      setState({ partsOrdered: true });
      showToast("Parts ordered from suppliers");
    },

    handleConfirmSlot: () => {
      const slot = state.availableSlots.find(s => s.id === state.selectedSlot);
      const newStep = 1;
      setState({
        orderStatus: "accepted",
        step: newStep,
        maxStepReached: Math.max(state.maxStepReached, newStep),
        appointmentConfirmed: true,
        focusedRole: "admin",
        clientHasNotif: false, 
        appointmentNotif: false, // Убираем модалку выбора у клиента
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

    handleDeclineRequest: () => {
      setState({
        requestDeclined: true,
        clientHasNotif: true,
        focusedRole: "client",
      });
      showToast("Request declined and archived");
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
      if (!state.appointmentConfirmed) {
        showToast("Cannot start repair: Appointment not confirmed by client/advisor", 3000);
        return;
      }
      
      const newStep = 2;
      setState({
        orderStatus: "in_progress",
        step: newStep,
        maxStepReached: Math.max(state.maxStepReached, newStep),
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
      if (state.additionalTaskDraft.trim()) {
        const newTask: AdditionalTask = {
          id: `task-${Date.now()}`,
          description: state.additionalTaskDraft,
          estimatedCost: 0,
          approved: false,
          declined: false,
          sentToAdmin: true,
          sentToClient: false,
          photos: [...state.additionalTaskPhotosDraft],
        };
        setState({
          additionalTasks: [...state.additionalTasks, newTask],
          showAdditionalTaskModal: false,
          additionalTaskDraft: "",
          additionalTaskPhotosDraft: [],
          focusedRole: "admin",
        });
        showToast("Task sent to Service Advisor for pricing");
      }
    },

    handleAdditionalTaskPhoto: () => {
      const photoId = Math.floor(Math.random() * 10) + 1;
      const photoUrl = `https://images.unsplash.com/photo-1517524008436-bbdb53c5aed5?auto=format&fit=crop&q=80&w=300&sig=${photoId}`;
      setState({
        additionalTaskPhotosDraft: [...state.additionalTaskPhotosDraft, photoUrl]
      });
      showToast("Photo attached to task");
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
    
    handleAdminSetTaskPrice: (taskId: string, price: number) => {
      setState({
        additionalTasks: state.additionalTasks.map(t =>
          t.id === taskId ? { ...t, estimatedCost: price } : t
        )
      });
    },

    handleAdminSendTaskToClient: (taskId: string) => {
      setState({
        additionalTasks: state.additionalTasks.map(t =>
          t.id === taskId ? { ...t, sentToClient: true, sentToAdmin: false } : t
        ),
        clientHasNotif: true,
        focusedRole: "client",
      });
      showToast("Price set and task sent to client for approval");
    },

    handleTechCheck: () => {
      const totalTasks = 2 + state.additionalTasks.filter(t => t.approved).length;
      if (state.checksCompleted < totalTasks) {
        setState({ checksCompleted: state.checksCompleted + 1 });
        showToast("Figma: Variant Checkbox = 'Checked'");
      }
    },

    handleTechComplete: () => {
      const newStep = 3;
      setState({
        orderStatus: "done",
        step: newStep,
        maxStepReached: Math.max(state.maxStepReached, newStep),
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
      const alreadyLoggedIn = (state.loggedInMechanics || []).some(m => m.mechanicId === mechanicId);
      if (!alreadyLoggedIn) {
        setState({
          loggedInMechanics: [
            ...(state.loggedInMechanics || []),
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

    handlePrevStep: () => {
      if (state.step > 0) {
        const prevStep = state.step - 1;
        const stateUpdate: any = { step: prevStep };
        
        if (prevStep === 0) {
          stateUpdate.orderStatus = "new";
          stateUpdate.techTaskVisible = false;
          stateUpdate.clientView = "form";
        } else if (prevStep === 1) {
          stateUpdate.orderStatus = "accepted";
          stateUpdate.techTaskVisible = false;
          stateUpdate.clientView = "tracking";
        } else if (prevStep === 2) {
          stateUpdate.orderStatus = "in_progress";
          stateUpdate.techTaskVisible = true;
          stateUpdate.clientView = "tracking";
        }
        
        setState(stateUpdate);
        showToast(`Back to Stage ${prevStep}`);
      }
    },

    handleNextStep: () => {
      if (state.step < 3) {
        const nextStep = state.step + 1;
        const stateUpdate: any = { 
          step: nextStep,
          maxStepReached: Math.max(state.maxStepReached, nextStep)
        };

        // Наполняем демо-данными только если поля пустые
        if (!state.formData.vehicle) {
          stateUpdate.formData = {
            ...state.formData,
            vehicle: "BMW X5",
            vin: "5UXKR0C58L9C12345",
            issue: "Brake system inspection and pad replacement",
            selectedServices: ["svc1", "svc3"],
            photos: [],
            prefersOriginalParts: true
          };
        }

        if (nextStep === 1) {
          stateUpdate.orderStatus = "accepted";
          if (!state.selectedSlot) stateUpdate.selectedSlot = "1";
          stateUpdate.clientView = "tracking";
        } else if (nextStep === 2) {
          stateUpdate.orderStatus = "in_progress";
          stateUpdate.techTaskVisible = true;
          stateUpdate.appointmentConfirmed = true;
          stateUpdate.intakePhotosComplete = true;
          
          if (state.selectedMechanics.length === 0) {
            stateUpdate.selectedMechanics = ["mech1", "mech2"];
            stateUpdate.loggedInMechanics = [
              { mechanicId: "mech1", name: "Nazar Sergeyev", loginTime: Date.now() },
              { mechanicId: "mech2", name: "Petra Svobodová", loginTime: Date.now() }
            ];
            stateUpdate.currentMechanicView = "mech1";
          }
          
          if (!state.selectedSlot) stateUpdate.selectedSlot = "1";
          if (!state.workStartTime) stateUpdate.workStartTime = Date.now();
          stateUpdate.clientView = "tracking";
        } else if (nextStep === 3) {
          stateUpdate.orderStatus = "done";
          stateUpdate.clientView = "tracking";
          stateUpdate.paymentInitiatedByAdvisor = true;
          stateUpdate.showPayment = true;
          stateUpdate.appointmentConfirmed = true;
          if (!state.selectedSlot) stateUpdate.selectedSlot = "1";
        }

        setState(stateUpdate);
        showToast(`Skipped to Stage ${nextStep} (with Demo Data)`);
      }
    },
  };
}
