"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Settings, Wrench, CheckCircle, Car,
  LayoutDashboard, Users, Calendar, ChevronRight,
  Info, Clock, Check, Camera, Upload, Package,
  AlertCircle, Truck, X, CreditCard, Sparkles
} from "lucide-react";

// Types for our state (Figma Variables)
type OrderStatus = "new" | "accepted" | "in_progress" | "done";
type AdminView = "requests" | "schedule" | "clients";
type ClientView = "form" | "tracking";

interface Part {
  id: string;
  name: string;
  available: boolean;
  quantity: number;
  price: number;
  estimatedDelivery?: string;
}

interface StandardService {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  requiredBay: string;
  requiredMechanic: string;
  requiredParts: string[];
}

interface ServiceHistory {
  id: string;
  vin: string;
  date: string;
  service: string;
  parts: string[];
  cost: number;
  mileage: number;
  notes: string;
  partsPreference: "OEM" | "Aftermarket" | "Mixed";
}

interface Bay {
  id: string;
  name: string;
  available: boolean;
  currentJob?: string;
}

interface Mechanic {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  currentJob?: string;
  rating: number;
}

interface AdditionalTask {
  id: string;
  description: string;
  estimatedCost: number;
  approved: boolean;
  declined: boolean;
}

interface Order {
  id: string;
  vehicle: string;
  vin: string;
  issue: string;
  status: OrderStatus;
  clientName: string;
  phone: string;
  scheduledTime?: string;
  photos?: string[];
  requiredParts?: Part[];
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  vin: string;
  lastVisit: string;
  totalOrders: number;
}

interface ScheduleItem {
  id: string;
  time: string;
  vehicle: string;
  vin: string;
  clientName: string;
  service: string;
  duration: string;
  status: "scheduled" | "in_progress" | "completed";
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  confirmBy?: string; // Deadline for confirmation
}

interface SystemState {
  step: number;
  orderStatus: OrderStatus;
  clientHasNotif: boolean;
  techTaskVisible: boolean;
  checksCompleted: number;
  focusedRole: "all" | "admin" | "tech";
  adminView: AdminView;
  clientView: ClientView;
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
    photos: string[];
    selectedServices: string[];
  };
  requiredParts: Part[];
  availableSlots: TimeSlot[];
  selectedSlot: string | null;
  partsOrdered: boolean;
  showPayment: boolean;
  paymentSuccess: boolean;
  appointmentNotif: boolean;
  appointmentConfirmed: boolean;
  vehiclePickedUp: boolean;
  formRejected: boolean;
  rejectionComment: string;
  showRejectionModal: boolean;
  rejectionDraft: string;
  selectedBay: string | null;
  selectedMechanics: string[];
  resourcesAllocated: boolean;
  intakePhotos: string[];
  intakePhotosComplete: boolean;
  offeredSlots: TimeSlot[];
  slotDeadlinePassed: boolean;
  additionalTasks: AdditionalTask[];
  showAdditionalTaskModal: boolean;
  additionalTaskDraft: string;
  additionalTaskCostDraft: string;
  paymentInitiatedByAdvisor: boolean;
}

const initialState: SystemState = {
  step: 0,
  orderStatus: "new",
  clientHasNotif: false,
  techTaskVisible: false,
  checksCompleted: 0,
  focusedRole: "all",
  adminView: "requests",
  clientView: "form",
  formData: {
    vehicle: "",
    vin: "",
    issue: "",
    photos: [],
    selectedServices: [],
  },
  requiredParts: [],
  availableSlots: [],
  selectedSlot: null,
  partsOrdered: false,
  showPayment: false,
  paymentSuccess: false,
  appointmentNotif: false,
  appointmentConfirmed: false,
  vehiclePickedUp: false,
  formRejected: false,
  rejectionComment: "",
  showRejectionModal: false,
  rejectionDraft: "",
  selectedBay: null,
  selectedMechanics: [],
  resourcesAllocated: false,
  intakePhotos: [],
  intakePhotosComplete: false,
  offeredSlots: [],
  slotDeadlinePassed: false,
  additionalTasks: [],
  showAdditionalTaskModal: false,
  additionalTaskDraft: "",
  additionalTaskCostDraft: "",
  paymentInitiatedByAdvisor: false,
};

// Mock data
const mockParts: Part[] = [
  { id: "1", name: "Front Brake Pads", available: true, quantity: 4, price: 2800, estimatedDelivery: undefined },
  { id: "2", name: "Brake Fluid", available: true, quantity: 10, price: 400, estimatedDelivery: undefined },
  { id: "3", name: "Brake Discs", available: false, quantity: 0, price: 5600, estimatedDelivery: "2026-05-11" },
];

const mockTimeSlots: TimeSlot[] = [
  { id: "1", time: "09:00 AM", date: "2026-05-10", available: true },
  { id: "2", time: "11:00 AM", date: "2026-05-10", available: true },
  { id: "3", time: "02:00 PM", date: "2026-05-10", available: false },
  { id: "4", time: "10:00 AM", date: "2026-05-11", available: true },
  { id: "5", time: "03:00 PM", date: "2026-05-11", available: true },
];

const mockStandardServices: StandardService[] = [
  {
    id: "svc1",
    name: "Oil Change",
    description: "Engine oil and filter replacement",
    duration: 30,
    price: 1200,
    requiredBay: "bay1",
    requiredMechanic: "mech1",
    requiredParts: ["oil-filter", "engine-oil"]
  },
  {
    id: "svc2",
    name: "Tire Change (Seasonal)",
    description: "Switch to summer/winter tires",
    duration: 45,
    price: 800,
    requiredBay: "bay2",
    requiredMechanic: "mech2",
    requiredParts: []
  },
  {
    id: "svc3",
    name: "Brake Inspection",
    description: "Full brake system check",
    duration: 60,
    price: 600,
    requiredBay: "bay1",
    requiredMechanic: "mech1",
    requiredParts: []
  },
  {
    id: "svc4",
    name: "Air Filter Replacement",
    description: "Cabin and engine air filter",
    duration: 20,
    price: 500,
    requiredBay: "bay3",
    requiredMechanic: "mech3",
    requiredParts: ["air-filter-cabin", "air-filter-engine"]
  },
  {
    id: "svc5",
    name: "Battery Check",
    description: "Battery health and charging system test",
    duration: 15,
    price: 300,
    requiredBay: "bay1",
    requiredMechanic: "mech1",
    requiredParts: []
  },
];

const mockServiceHistory: ServiceHistory[] = [
  {
    id: "h1",
    vin: "5UXKR0C58L9C12345",
    date: "2026-03-15",
    service: "Brake Pads Replacement",
    parts: ["Front Brake Pads", "Brake Fluid"],
    cost: 3200,
    mileage: 45000,
    notes: "Customer requested OEM parts",
    partsPreference: "OEM"
  },
  {
    id: "h2",
    vin: "5UXKR0C58L9C12345",
    date: "2025-12-10",
    service: "Oil Change + Filter",
    parts: ["Engine Oil", "Oil Filter"],
    cost: 1500,
    mileage: 42000,
    notes: "Regular maintenance",
    partsPreference: "OEM"
  },
  {
    id: "h3",
    vin: "5UXKR0C58L9C12345",
    date: "2025-09-05",
    service: "Tire Rotation",
    parts: [],
    cost: 800,
    mileage: 38000,
    notes: "Seasonal tire change to winter tires",
    partsPreference: "OEM"
  },
  {
    id: "h4",
    vin: "WDDGF8AB9EA123456",
    date: "2026-04-20",
    service: "Engine Diagnostics",
    parts: ["Spark Plugs", "Air Filter"],
    cost: 2800,
    mileage: 52000,
    notes: "Customer prefers aftermarket parts for cost savings",
    partsPreference: "Aftermarket"
  },
  {
    id: "h5",
    vin: "WDDGF8AB9EA123456",
    date: "2026-01-15",
    service: "Battery Replacement",
    parts: ["Battery"],
    cost: 3500,
    mileage: 50000,
    notes: "OEM battery requested",
    partsPreference: "OEM"
  },
];

const mockBays: Bay[] = [
  { id: "bay1", name: "Bay 1 (Lift A)", available: true },
  { id: "bay2", name: "Bay 2 (Lift B)", available: true },
  { id: "bay3", name: "Bay 3 (Lift C)", available: false, currentJob: "Oil change in progress" },
  { id: "bay4", name: "Bay 4 (Alignment)", available: true },
];

const mockMechanics: Mechanic[] = [
  { id: "mech1", name: "John Martinez", specialty: "Brakes & Suspension", available: true, rating: 4.9 },
  { id: "mech2", name: "Sarah Chen", specialty: "Engine & Transmission", available: true, rating: 4.8 },
  { id: "mech3", name: "Mike Johnson", specialty: "Electrical & Diagnostics", available: false, currentJob: "Working on Bay 3", rating: 4.7 },
  { id: "mech4", name: "Lisa Anderson", specialty: "General Maintenance", available: true, rating: 4.6 },
];

const mockOrders: Order[] = [
  { id: "1", vehicle: "BMW X5", vin: "5UXKR0C58L9C12345", issue: "Grinding noise when braking", status: "new", clientName: "John Smith", phone: "+1 555-0101", scheduledTime: "10:00 AM" },
  { id: "2", vehicle: "Mercedes C-Class", vin: "WDDGF8AB9EA123456", issue: "Engine check light", status: "accepted", clientName: "Sarah Johnson", phone: "+1 555-0102", scheduledTime: "11:30 AM" },
  { id: "3", vehicle: "Audi A4", vin: "WAUZZZ8K8DA234567", issue: "Oil change service", status: "in_progress", clientName: "Mike Davis", phone: "+1 555-0103", scheduledTime: "09:00 AM" },
  { id: "4", vehicle: "Tesla Model 3", vin: "5YJ3E1EA8KF345678", issue: "Tire rotation", status: "done", clientName: "Emily Brown", phone: "+1 555-0104", scheduledTime: "08:00 AM" },
];

const mockClients: Client[] = [
  { id: "1", name: "John Smith", phone: "+1 555-0101", email: "john.smith@email.com", vehicle: "BMW X5", vin: "5UXKR0C58L9C12345", lastVisit: "2026-05-09", totalOrders: 12 },
  { id: "2", name: "Sarah Johnson", phone: "+1 555-0102", email: "sarah.j@email.com", vehicle: "Mercedes C-Class", vin: "WDDGF8AB9EA123456", lastVisit: "2026-05-08", totalOrders: 8 },
  { id: "3", name: "Mike Davis", phone: "+1 555-0103", email: "mike.d@email.com", vehicle: "Audi A4", vin: "WAUZZZ8K8DA234567", lastVisit: "2026-05-09", totalOrders: 15 },
  { id: "4", name: "Emily Brown", phone: "+1 555-0104", email: "emily.b@email.com", vehicle: "Tesla Model 3", vin: "5YJ3E1EA8KF345678", lastVisit: "2026-05-09", totalOrders: 5 },
  { id: "5", name: "David Wilson", phone: "+1 555-0105", email: "david.w@email.com", vehicle: "Toyota Camry", vin: "4T1BF1FK8CU456789", lastVisit: "2026-05-07", totalOrders: 20 },
  { id: "6", name: "Lisa Anderson", phone: "+1 555-0106", email: "lisa.a@email.com", vehicle: "Honda Accord", vin: "1HGCV1F30JA567890", lastVisit: "2026-05-06", totalOrders: 10 },
];

const mockSchedule: ScheduleItem[] = [
  { id: "1", time: "08:00 AM", vehicle: "Tesla Model 3", vin: "5YJ3E1EA8KF345678", clientName: "Emily Brown", service: "Tire rotation", duration: "1h", status: "completed" },
  { id: "2", time: "09:00 AM", vehicle: "Audi A4", vin: "WAUZZZ8K8DA234567", clientName: "Mike Davis", service: "Oil change service", duration: "1.5h", status: "in_progress" },
  { id: "3", time: "10:00 AM", vehicle: "BMW X5", vin: "A123BC", clientName: "John Smith", service: "Brake system repair", duration: "2h", status: "scheduled" },
  { id: "4", time: "11:30 AM", vehicle: "Mercedes C-Class", vin: "B456DE", clientName: "Sarah Johnson", service: "Engine diagnostics", duration: "1h", status: "scheduled" },
  { id: "5", time: "01:00 PM", vehicle: "Toyota Camry", vin: "E345JK", clientName: "David Wilson", service: "Full inspection", duration: "2h", status: "scheduled" },
  { id: "6", time: "03:00 PM", vehicle: "Honda Accord", vin: "F678LM", clientName: "Lisa Anderson", service: "AC repair", duration: "1.5h", status: "scheduled" },
];

export default function PrototypePage() {
  const [state, setState] = useState<SystemState>(initialState);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Emulate Figma toasts
  const updateState = (updates: Partial<SystemState>, actionMsg: string) => {
    setState((prev) => ({ ...prev, ...updates }));
    setToast({ show: true, msg: actionMsg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const reset = () => setState(initialState);

  // --- Actions ---
  const handleViewChange = (view: AdminView) => {
    setState((prev) => ({ ...prev, adminView: view }));
  };

  // Client form handlers
  const handleFormChange = (field: string, value: string | string[]) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value }
    }));
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const photoUrl = `https://via.placeholder.com/400x300?text=Photo+${state.formData.photos.length + 1}`;
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        photos: [...prev.formData.photos, photoUrl]
      }
    }));
    setToast({ show: true, msg: "Photo uploaded successfully" });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  const handleSubmitRequest = () => {
    updateState({
      clientView: "tracking",
      orderStatus: "new",
      step: 0,
    }, "Request submitted - waiting for technician review");
  };

  // Tech review handlers
  const handleTechReview = () => {
    // Auto-allocate bay and mechanics based on selected services
    const availableBay = mockBays.find(b => b.available);
    const availableMechanics = mockMechanics.filter(m => m.available);

    // Select mechanics based on service requirements
    const selectedMechs = state.formData.selectedServices.length > 0
      ? availableMechanics.slice(0, Math.min(2, availableMechanics.length)).map(m => m.id)
      : availableMechanics.slice(0, 1).map(m => m.id);

    updateState({
      requiredParts: mockParts,
      focusedRole: "admin",
      selectedBay: availableBay?.id || null,
      selectedMechanics: selectedMechs,
      resourcesAllocated: true,
    }, "Technician reviewing - resources allocated");
  };

  const handleCheckParts = () => {
    const unavailableParts = state.requiredParts.filter(p => !p.available);
    if (unavailableParts.length > 0) {
      // Order parts and offer 3 slots with confirmation deadlines
      const slotsAfterDelivery = mockTimeSlots.filter(s => s.date >= "2026-05-11");

      // Select 3 slots and add confirmation deadlines
      const offeredSlots = slotsAfterDelivery.slice(0, 3).map((slot, idx) => ({
        ...slot,
        confirmBy: idx === 0 ? "2026-05-10 18:00" : idx === 1 ? "2026-05-10 20:00" : "2026-05-11 10:00"
      }));

      updateState({
        partsOrdered: true,
        offeredSlots: offeredSlots,
        availableSlots: offeredSlots,
        focusedRole: "client",
        clientHasNotif: true,
      }, `Ordering ${unavailableParts.length} parts from factory - 3 slots offered with deadlines`);
    } else {
      // All parts available - offer 3 immediate slots
      const offeredSlots = mockTimeSlots.slice(0, 3).map((slot, idx) => ({
        ...slot,
        confirmBy: idx === 0 ? "2026-05-10 16:00" : idx === 1 ? "2026-05-10 18:00" : "2026-05-10 20:00"
      }));

      updateState({
        offeredSlots: offeredSlots,
        availableSlots: offeredSlots,
        focusedRole: "client",
        clientHasNotif: true,
      }, "All parts available - 3 slots offered with deadlines");
    }
  };

  const handleSelectSlot = (slotId: string) => {
    setState((prev) => ({ ...prev, selectedSlot: slotId }));
  };

  const handleConfirmSlot = () => {
    const slot = state.availableSlots.find(s => s.id === state.selectedSlot);
    updateState({
      orderStatus: "accepted",
      step: 1,
      appointmentNotif: true,
      focusedRole: "admin",
    }, `✓ Appointment scheduled for ${slot?.date} at ${slot?.time}`);
  };

  const handleConfirmAppointment = () => {
    updateState({
      appointmentConfirmed: true,
      appointmentNotif: false,
      clientHasNotif: true,
    }, "Client confirmed appointment");
  };

  const handleDeclineAppointment = () => {
    updateState({
      appointmentNotif: false,
      selectedSlot: null,
      orderStatus: "new",
      step: 0,
    }, "Client declined appointment - select new time");
  };

  const handlePickUpVehicle = () => {
    updateState({
      vehiclePickedUp: true,
      step: 4,
    }, "Vehicle picked up - order completed!");
  };

  const handleAdminAccept = () => {
    updateState({
      orderStatus: "accepted",
      step: 1,
      focusedRole: "admin",
      clientHasNotif: true
    }, "Figma: Set Variable orderStatus = 'accepted'");
  };

  const handleRejectForm = (comment: string) => {
    updateState({
      formRejected: true,
      rejectionComment: comment,
      clientHasNotif: true,
      clientView: "form",
      orderStatus: "new",
      focusedRole: "client",
      showRejectionModal: false,
      rejectionDraft: "",
    }, "Form rejected - sent back to client with comments");
  };

  const handleOpenRejectionModal = () => {
    updateState({ showRejectionModal: true });
  };

  const handleCloseRejectionModal = () => {
    updateState({ showRejectionModal: false, rejectionDraft: "" });
  };

  const handleSubmitRejection = () => {
    if (state.rejectionDraft.trim()) {
      handleRejectForm(state.rejectionDraft);
    }
  };

  const handleResubmitForm = () => {
    updateState({
      formRejected: false,
      rejectionComment: "",
      clientView: "tracking",
      clientHasNotif: false,
      focusedRole: "admin",
    }, "Form resubmitted after changes");
  };

  const handleAdminSend = () => {
    updateState({
      orderStatus: "in_progress",
      step: 2,
      techTaskVisible: true,
      focusedRole: "tech",
      clientView: "tracking",
    }, "Figma: Set Variable orderStatus = 'in_progress'");

    // Scroll to tech tablet smoothly
    setTimeout(() => {
      const techSection = document.querySelector('[data-section="tech"]');
      if (techSection) {
        techSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const handleIntakePhoto = () => {
    const photoUrl = `https://via.placeholder.com/400x300?text=Intake+Photo+${state.intakePhotos.length + 1}`;
    updateState({
      intakePhotos: [...state.intakePhotos, photoUrl]
    }, "Intake photo captured");
  };

  const handleCompleteIntakePhotos = () => {
    updateState({
      intakePhotosComplete: true
    }, "Intake photos completed");
  };

  const handleOpenAdditionalTaskModal = () => {
    updateState({ showAdditionalTaskModal: true });
  };

  const handleCloseAdditionalTaskModal = () => {
    updateState({
      showAdditionalTaskModal: false,
      additionalTaskDraft: "",
      additionalTaskCostDraft: ""
    });
  };

  const handleSubmitAdditionalTask = () => {
    if (state.additionalTaskDraft.trim() && state.additionalTaskCostDraft.trim()) {
      const newTask: AdditionalTask = {
        id: `task-${Date.now()}`,
        description: state.additionalTaskDraft,
        estimatedCost: parseFloat(state.additionalTaskCostDraft),
        approved: false,
        declined: false,
      };
      updateState({
        additionalTasks: [...state.additionalTasks, newTask],
        showAdditionalTaskModal: false,
        additionalTaskDraft: "",
        additionalTaskCostDraft: "",
        clientHasNotif: true,
        focusedRole: "client",
      }, "Additional task sent to client for approval");
    }
  };

  const handleApproveAdditionalTask = (taskId: string) => {
    updateState({
      additionalTasks: state.additionalTasks.map(t =>
        t.id === taskId ? { ...t, approved: true } : t
      ),
      focusedRole: "tech",
    }, "Additional task approved by client");
  };

  const handleDeclineAdditionalTask = (taskId: string) => {
    updateState({
      additionalTasks: state.additionalTasks.map(t =>
        t.id === taskId ? { ...t, declined: true } : t
      ),
      focusedRole: "tech",
    }, "Additional task declined by client");
  };

  const handleTechCheck = () => {
    const totalTasks = 2 + state.additionalTasks.filter(t => t.approved).length;
    if (state.checksCompleted < totalTasks) {
      updateState({ checksCompleted: state.checksCompleted + 1 }, "Figma: Variant Checkbox = 'Checked'");
    }
  };

  const handleTechComplete = () => {
    updateState({
      orderStatus: "done",
      step: 3,
      clientHasNotif: true,
      focusedRole: "all"
    }, "Figma: Set Variable orderStatus = 'done'");
  };

  const handleClientReadNotif = () => {
    updateState({ clientHasNotif: false }, "Figma: Set Variable clientHasNotif = false");
  };

  const handlePayment = () => {
    setState((prev) => ({ ...prev, showPayment: true }));

    // Simulate payment processing
    setTimeout(() => {
      setState((prev) => ({ ...prev, paymentSuccess: true }));

      // Hide payment modal and show thank you message
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          showPayment: false,
          clientHasNotif: false
        }));
      }, 2000);
    }, 1500);
  };

  const handleAdvisorInitiatePayment = () => {
    updateState({
      paymentInitiatedByAdvisor: true,
      clientHasNotif: true,
      focusedRole: "client",
    }, "Service Advisor initiated payment - sent to client");
  };

  // Helper classes for focus
  const getOpacity = (role: "admin" | "tech" | "client") => {
    if (state.focusedRole === "all") return "opacity-100";
    // Keep client in focus when appointment notification is shown
    if (role === "client" && state.appointmentNotif && !state.appointmentConfirmed) return "opacity-100";
    if (state.focusedRole === "admin" && role !== "admin") return "opacity-40";
    if (state.focusedRole === "tech" && role !== "tech") return "opacity-40";
    return "opacity-100";
  };

  return (
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">

        {/* Figma Toast */}
        <AnimatePresence>
          {toast.show && (
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-emerald-200 text-emerald-700 px-6 py-3 rounded-lg shadow-xl font-mono text-sm pointer-events-none"
              >
                ⚡ {toast.msg}
              </motion.div>
          )}
        </AnimatePresence>

        {/* Top Presentation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <Settings className="text-red-600" />
            <span className="text-gray-900">GLOBAL<span className="text-red-600">CARS</span></span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            {[
              { n: 0, label: "Request" },
              { n: 1, label: "Acceptance" },
              { n: 2, label: "Repair" },
              { n: 3, label: "Delivery" }
            ].map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className={`flex items-center gap-2 transition-colors ${state.step === s.n ? 'text-red-600' : state.step > s.n ? 'text-emerald-600' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${state.step === s.n ? 'bg-red-600 border-red-600 text-white' : state.step > s.n ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                      {s.n}
                    </div>
                    {s.label}
                  </div>
                  {i < 3 && <ChevronRight className="w-4 h-4 opacity-30" />}
                </React.Fragment>
            ))}
          </div>

          <button onClick={reset} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium">
            ↺ Reset
          </button>
        </header>

        {/* Workspace */}
        <main className="flex-1 flex gap-6 p-6 overflow-auto bg-gray-100">

          {/* 1. CLIENT MOBILE APP */}
          <div className={`w-[400px] shrink-0 bg-white border border-gray-200 rounded-[2rem] flex flex-col relative shadow-xl transition-opacity duration-500 ${getOpacity('client')}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 px-4 py-1 text-[10px] font-bold tracking-widest text-white rounded-b-lg uppercase">iOS App</div>

            <div className="p-6 pt-10 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="font-bold text-lg flex items-center gap-2 text-gray-900"><Settings className="w-5 h-5 text-red-600"/> GlobalCars</div>
              <div className="relative cursor-pointer" onClick={handleClientReadNotif}>
                <Bell className="w-6 h-6 text-gray-700" />
                <AnimatePresence>
                  {state.clientHasNotif && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white" />
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto flex flex-col">

              {/* FORM VIEW */}
              {state.clientView === 'form' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">New Service Request</h3>
                  <p className="text-sm text-gray-600 mb-4">Fill in the details about your vehicle issue</p>

                  {state.formRejected && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 mb-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-sm text-amber-900 mb-1">Changes Requested</div>
                          <p className="text-xs text-amber-800 mb-3">{state.rejectionComment}</p>
                          <button
                            onClick={handleResubmitForm}
                            className="text-xs font-bold text-amber-700 hover:text-amber-900 underline"
                          >
                            Resubmit after making changes →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Vehicle Model</label>
                    <input
                      type="text"
                      value={state.formData.vehicle}
                      onChange={(e) => handleFormChange('vehicle', e.target.value)}
                      placeholder="e.g., BMW X5"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">VIN (Vehicle Identification Number)</label>
                    <input
                      type="text"
                      value={state.formData.vin}
                      onChange={(e) => handleFormChange('vin', e.target.value)}
                      placeholder="e.g., 1HGBH41JXMN109186"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Describe the Issue</label>
                    <textarea
                      value={state.formData.issue}
                      onChange={(e) => handleFormChange('issue', e.target.value)}
                      placeholder="What's wrong with your vehicle?"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Standard Services (Optional)</label>
                    <div className="space-y-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      {mockStandardServices.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={state.formData.selectedServices.includes(service.id)}
                            onChange={(e) => {
                              const newServices = e.target.checked
                                ? [...state.formData.selectedServices, service.id]
                                : state.formData.selectedServices.filter(id => id !== service.id);
                              handleFormChange('selectedServices', newServices);
                            }}
                            className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-900">{service.name}</span>
                              <span className="text-sm font-bold text-red-600">{service.price} Kč</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">{service.description}</p>
                            <p className="text-xs text-gray-500 mt-1">~{service.duration} min</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Photos (Optional)</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {state.formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setState(prev => ({
                              ...prev,
                              formData: {
                                ...prev.formData,
                                photos: prev.formData.photos.filter((_, i) => i !== idx)
                              }
                            }))}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handlePhotoUpload}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Camera className="w-4 h-4" />
                      Add Photo
                    </button>
                  </div>

                  <button
                    onClick={handleSubmitRequest}
                    disabled={!isClient || !state.formData.vehicle || !state.formData.vin || !state.formData.issue}
                    className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
                  >
                    Submit Request
                  </button>
                </motion.div>
              )}

              {/* TRACKING VIEW */}
              {state.clientView === 'tracking' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-semibold text-gray-900 mb-4">{state.formData.vehicle} ({state.formData.vin})</h3>

                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 relative z-0">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs text-gray-500 font-medium">Order Status</span>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${state.orderStatus === 'new' ? 'bg-amber-100 text-amber-700' : state.orderStatus === 'accepted' ? 'bg-blue-100 text-blue-700' : state.orderStatus === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {state.orderStatus === 'new' ? 'Pending' : state.orderStatus === 'accepted' ? 'Accepted' : state.orderStatus === 'in_progress' ? 'In Progress' : 'Done'}
                    </span>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-3 border-l-2 border-gray-200 space-y-6">
                      <div className={`relative transition-opacity ${state.step >= 0 ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${state.step >= 1 ? 'bg-emerald-600' : 'bg-amber-500 ring-4 ring-amber-100'}`} />
                        <div className="text-sm font-semibold text-gray-900">Request Created</div>
                        <div className="text-xs text-gray-500 mt-1">{state.formData.issue}</div>
                      </div>
                      <div className={`relative transition-opacity duration-500 ${state.step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${state.step >= 3 ? 'bg-emerald-600' : state.step === 2 ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-gray-300'}`} />
                        <div className="text-sm font-semibold text-gray-900">In Progress</div>
                        <div className="text-xs text-gray-500 mt-1">Vehicle in repair bay</div>
                      </div>
                      <div className={`relative transition-opacity duration-500 ${state.step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`absolute -left-[17px] top-0 w-3 h-3 rounded-full ${state.step === 3 ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-gray-300'}`} />
                        <div className="text-sm font-semibold text-gray-900">Ready for Pickup</div>
                        <div className="text-xs text-gray-500 mt-1">Waiting for you at the service</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <AnimatePresence>
                      {/* Appointment Confirmation Notification */}
                      {state.appointmentNotif && !state.appointmentConfirmed && (
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 50, opacity: 0 }}
                          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm mb-4"
                        >
                          <div className="flex gap-3 items-start mb-3">
                            <Calendar className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                              <div className="text-sm font-bold text-gray-900 mb-1">Appointment Scheduled</div>
                              <div className="text-xs text-gray-700 mb-1">
                                {state.availableSlots.find(s => s.id === state.selectedSlot)?.date}
                              </div>
                              <div className="text-xs text-gray-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {state.availableSlots.find(s => s.id === state.selectedSlot)?.time}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mb-3">
                            Please confirm if this time works for you
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleConfirmAppointment}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all"
                            >
                              ✓ Confirm
                            </button>
                            <button
                              onClick={handleDeclineAppointment}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-xs font-bold transition-all"
                            >
                              ✗ Decline
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Additional Tasks Approval */}
                      {state.additionalTasks.filter(t => !t.approved && !t.declined).map(task => (
                        <motion.div
                          key={task.id}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 50, opacity: 0 }}
                          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm"
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
                              onClick={() => handleApproveAdditionalTask(task.id)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleDeclineAdditionalTask(task.id)}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-xs font-bold transition-all"
                            >
                              ✗ Decline
                            </button>
                          </div>
                        </motion.div>
                      ))}

                      {state.orderStatus === 'done' && state.paymentInitiatedByAdvisor && !state.paymentSuccess && (
                          <motion.div
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 50, opacity: 0 }}
                              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm"
                          >
                            <div className="flex gap-4 items-center mb-3">
                              <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                              <div>
                                <div className="text-sm font-bold text-gray-900">Repair Completed!</div>
                                <div className="text-xs text-gray-600 mt-1">Brake pads replaced</div>
                              </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 mb-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-600">Parts & Labor</span>
                                <span className="text-sm font-bold text-gray-900">3,800 Kč</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Service Fee</span>
                                <span className="text-sm font-bold text-gray-900">400 Kč</span>
                              </div>
                              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-red-600">4,200 Kč</span>
                              </div>
                            </div>
                            <button
                              onClick={handlePayment}
                              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                              <CreditCard className="w-5 h-5" />
                              Pay with Apple Pay
                            </button>
                          </motion.div>
                      )}

                      {/* Payment Processing Animation */}
                      {state.orderStatus === 'done' && state.showPayment && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg"
                        >
                          {!state.paymentSuccess ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center"
                            >
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
                            </motion.div>
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
                                4,200 Kč paid
                              </motion.p>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Thank You Message */}
                      {state.orderStatus === 'done' && state.paymentSuccess && !state.showPayment && !state.vehiclePickedUp && (
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-6 shadow-sm text-center"
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
                            onClick={handlePickUpVehicle}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <Car className="w-5 h-5" />
                            Pick Up Vehicle
                          </button>
                        </motion.div>
                      )}

                      {/* Vehicle Picked Up - Final Message */}
                      {state.vehiclePickedUp && (
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
                          <p className="text-sm text-gray-700 mb-1">Your {state.formData.vehicle} is ready</p>
                          <p className="text-xs text-gray-600">Safe travels! 🚗</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN (Admin & Tech) */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">

            {/* 2. ADMIN WEB APP */}
            <div className={`bg-white border border-gray-200 rounded-3xl flex flex-col relative shadow-xl transition-all duration-700 ${getOpacity('admin')} ${state.orderStatus === 'in_progress' ? 'flex-[1]' : 'flex-[3]'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 px-4 py-1 text-[10px] font-bold tracking-widest text-white rounded-b-lg uppercase">Web CRM</div>

              <div className="p-4 pt-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="text-sm font-medium text-gray-600 flex items-center gap-2"><Users className="w-4 h-4"/> Service Advisor</div>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Shift Active</span>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="w-48 border-r border-gray-100 p-4 space-y-2 shrink-0 bg-gray-50">
                  <div
                    onClick={() => handleViewChange('requests')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${state.adminView === 'requests' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <LayoutDashboard className="w-4 h-4"/> Requests
                  </div>
                  <div
                    onClick={() => handleViewChange('schedule')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${state.adminView === 'schedule' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <Calendar className="w-4 h-4"/> Schedule
                  </div>
                  <div
                    onClick={() => handleViewChange('clients')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${state.adminView === 'clients' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <Car className="w-4 h-4"/> Clients
                  </div>
                </div>

                {/* REQUESTS VIEW */}
                {state.adminView === 'requests' && (
                <div className="flex-1 p-6 flex gap-6 overflow-x-auto">
                  {/* Kanban Column 1 */}
                  <div className="flex-1 min-w-[280px]">
                    <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">Incoming <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">1</span></h4>

                    {state.clientView === 'tracking' && state.orderStatus === 'new' && (
                        <motion.div layout className="bg-white border-l-4 border-l-amber-500 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-gray-900">{state.formData.vehicle} · {state.formData.vin}</div>
                            <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase bg-amber-100 text-amber-700">New</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Issue: {state.formData.issue}</p>

                          {state.formData.selectedServices.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs font-semibold text-gray-700 mb-1">Selected Services:</div>
                              <div className="flex flex-wrap gap-1">
                                {state.formData.selectedServices.map(svcId => {
                                  const service = mockStandardServices.find(s => s.id === svcId);
                                  return service ? (
                                    <span key={svcId} className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                      {service.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}

                          {state.formData.photos.length > 0 && (
                            <div className="flex gap-1 mb-3">
                              {state.formData.photos.slice(0, 3).map((photo, idx) => (
                                <img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="w-12 h-12 rounded object-cover border border-gray-200" />
                              ))}
                            </div>
                          )}

                          {/* Service History by VIN */}
                          {(() => {
                            const history = mockServiceHistory.filter(h => h.vin === state.formData.vin);
                            if (history.length > 0) {
                              const latestService = history[0];
                              const preference = latestService.partsPreference;
                              return (
                                <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-bold text-blue-900">Service History</span>
                                  </div>
                                  <div className="text-xs text-blue-800 space-y-1">
                                    <div>Last visit: {latestService.date}</div>
                                    <div>Total visits: {history.length}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="font-semibold">Parts Preference:</span>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        preference === 'OEM' ? 'bg-emerald-100 text-emerald-700' :
                                        preference === 'Aftermarket' ? 'bg-amber-100 text-amber-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                        {preference}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}

                          <div className="flex gap-2">
                            <button
                              onClick={handleTechReview}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={handleOpenRejectionModal}
                              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                            >
                              ← Request Changes
                            </button>
                          </div>
                        </motion.div>
                    )}
                  </div>

                  {/* Kanban Column 2 - Parts Check */}
                  <div className="flex-1 min-w-[320px]">
                    <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
                      Parts Review
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                        {state.requiredParts.length > 0 ? '1' : '0'}
                      </span>
                    </h4>

                    {state.requiredParts.length > 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-600" />
                          Required Parts
                        </div>

                        <div className="space-y-2 mb-4">
                          {state.requiredParts.map((part) => (
                            <div key={part.id} className={`p-3 rounded-lg border ${part.available ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                              <div className="flex justify-between items-start mb-1">
                                <div className="text-sm font-medium text-gray-900">{part.name}</div>
                                <div className="text-xs font-bold text-gray-700">{part.price} Kč</div>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                {part.available ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-700">In stock ({part.quantity})</span>
                                  </>
                                ) : (
                                  <>
                                    <Truck className="w-3 h-3 text-amber-600" />
                                    <span className="text-amber-700">Order needed - ETA: {part.estimatedDelivery}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bay & Mechanics Allocation */}
                        {state.resourcesAllocated && (
                          <div className="mb-4 space-y-3">
                            {/* Bay Selection */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="font-bold text-sm text-blue-900 mb-2 flex items-center gap-2">
                                <Wrench className="w-4 h-4" />
                                Assigned Bay
                              </div>
                              {state.selectedBay && (() => {
                                const bay = mockBays.find(b => b.id === state.selectedBay);
                                return bay ? (
                                  <div className="text-xs text-blue-800 flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-blue-600" />
                                    {bay.name}
                                  </div>
                                ) : null;
                              })()}
                            </div>

                            {/* Mechanics Selection */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <div className="font-bold text-sm text-purple-900 mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Assigned Mechanics
                              </div>
                              <div className="space-y-1">
                                {state.selectedMechanics.map(mechId => {
                                  const mech = mockMechanics.find(m => m.id === mechId);
                                  return mech ? (
                                    <div key={mechId} className="text-xs text-purple-800 flex items-center justify-between">
                                      <span className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-purple-600" />
                                        {mech.name}
                                      </span>
                                      <span className="text-[10px] bg-purple-100 px-2 py-0.5 rounded-full">
                                        {mech.specialty}
                                      </span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {!state.partsOrdered && state.requiredParts.some(p => !p.available) && (
                          <button
                            onClick={handleCheckParts}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                          >
                            <Truck className="w-4 h-4" />
                            Order Missing Parts
                          </button>
                        )}

                        {state.partsOrdered && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold mb-1">✓ Parts ordered from factory</div>
                              <div>Estimated delivery: May 11, 2026</div>
                              <div className="mt-2 text-emerald-700 font-semibold">→ Check available slots after delivery date</div>
                            </div>
                          </div>
                        )}

                        {state.requiredParts.every(p => p.available) && !state.availableSlots.length && (
                          <button
                            onClick={handleCheckParts}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                          >
                            Show Available Slots
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Kanban Column 3 - Time Slots */}
                  <div className="flex-1 min-w-[280px]">
                    <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
                      Schedule
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                        {state.availableSlots.length > 0 ? state.availableSlots.filter(s => s.available).length : '0'}
                      </span>
                    </h4>

                    {state.availableSlots.length > 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          Available Times
                        </div>

                        {state.partsOrdered && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3 text-xs text-amber-700 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>Slots available after parts delivery (May 11+)</span>
                          </div>
                        )}

                        {state.offeredSlots.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="text-xs font-bold text-blue-900 mb-1">⏰ Limited Time Offer</div>
                            <div className="text-xs text-blue-800">
                              We've reserved {state.offeredSlots.length} time slots for you. Please confirm your preferred slot before the deadline to secure your booking.
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
                          {state.availableSlots.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => handleSelectSlot(slot.id)}
                              disabled={!slot.available}
                              className={`w-full p-3 rounded-lg border text-left transition-all ${
                                state.selectedSlot === slot.id
                                  ? 'bg-red-50 border-red-500 ring-2 ring-red-200'
                                  : slot.available
                                    ? 'bg-white border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                    : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className="text-sm font-bold text-gray-900">{slot.time}</div>
                              <div className="text-xs text-gray-600">{slot.date}</div>
                              {slot.confirmBy && (
                                <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Confirm by: {slot.confirmBy}
                                </div>
                              )}
                              {!slot.available && <div className="text-xs text-red-600 mt-1">Booked</div>}
                            </button>
                          ))}
                        </div>

                        {state.selectedSlot && (
                          <button
                            onClick={handleConfirmSlot}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                          >
                            Confirm Appointment
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Kanban Column 4 - Scheduled */}
                  <div className="flex-1 min-w-[280px]">
                    <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
                      Scheduled
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                        {state.orderStatus === 'accepted' ? '1' : '0'}
                      </span>
                    </h4>
                    {state.orderStatus === 'accepted' && state.selectedSlot && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-l-4 border-l-blue-500 border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="font-bold mb-2 text-gray-900">{state.formData.vehicle} · {state.formData.vin}</div>
                          <div className="text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-3 h-3" />
                              {state.availableSlots.find(s => s.id === state.selectedSlot)?.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {state.availableSlots.find(s => s.id === state.selectedSlot)?.time}
                            </div>
                          </div>
                          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase mb-3 inline-block">
                            {state.appointmentConfirmed ? 'Confirmed by Client' : 'Awaiting Confirmation'}
                          </span>

                          {state.appointmentConfirmed ? (
                            <button
                              onClick={handleAdminSend}
                              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md mt-2"
                            >
                              Send to Repair Bay
                            </button>
                          ) : (
                            <div className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg text-xs font-bold text-center mt-2">
                              Waiting for client confirmation...
                            </div>
                          )}
                        </motion.div>
                    )}
                  </div>

                  {/* Kanban Column 5 - Completed */}
                  <div className="flex-1 min-w-[280px]">
                    <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">Completed <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">{state.orderStatus === 'done' ? '1' : '0'}</span></h4>
                    {state.orderStatus === 'done' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-l-4 border-l-emerald-500 border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="font-bold mb-1 text-gray-900">{state.formData.vehicle} · {state.formData.vin}</div>
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase mb-3 inline-block">
                            {state.paymentSuccess ? 'Paid' : state.paymentInitiatedByAdvisor ? 'Payment Sent' : 'Awaiting Payment'}
                          </span>

                          {!state.paymentInitiatedByAdvisor && !state.paymentSuccess && (
                            <button
                              onClick={handleAdvisorInitiatePayment}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                              <CreditCard className="w-4 h-4" />
                              Send Payment Request
                            </button>
                          )}
                        </motion.div>
                    )}
                  </div>
                </div>
                )}

                {/* SCHEDULE VIEW */}
                {state.adminView === 'schedule' && (
                <div className="flex-1 p-6 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">Today's Schedule - May 9, 2026</h2>
                  <div className="space-y-3">
                    {mockSchedule.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all ${
                          item.status === 'completed' ? 'border-emerald-200 opacity-60' :
                          item.status === 'in_progress' ? 'border-amber-300' :
                          'border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg px-4 py-2 min-w-[80px]">
                          <Clock className="w-4 h-4 text-gray-500 mb-1" />
                          <div className="text-sm font-bold text-gray-900">{item.time}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-bold text-gray-900">{item.vehicle} · {item.vin}</div>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                              item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              item.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {item.status === 'completed' ? 'Completed' : item.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">{item.clientName} · {item.service}</div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                )}

                {/* CLIENTS VIEW */}
                {state.adminView === 'clients' && (
                <div className="flex-1 p-6 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">Client Database</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {mockClients.map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-bold text-lg text-gray-900 mb-1">{client.name}</div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                {client.phone}
                              </div>
                              <div>{client.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">Total Orders</div>
                            <div className="text-2xl font-bold text-red-600">{client.totalOrders}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{client.vehicle}</span>
                            <span className="text-xs text-gray-500">· {client.vin}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last visit: {client.lastVisit}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                )}

              </div>

              {/* Rejection Modal */}
              <AnimatePresence>
                {state.showRejectionModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
                    onClick={handleCloseRejectionModal}
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
                          value={state.rejectionDraft}
                          onChange={(e) => setState(prev => ({ ...prev, rejectionDraft: e.target.value }))}
                          placeholder="e.g., Please provide more details about when the grinding noise occurs..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleCloseRejectionModal}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitRejection}
                          disabled={!state.rejectionDraft?.trim()}
                          className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Send to Client
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. TECH TABLET APP */}
            <div data-section="tech" className={`bg-white border border-gray-200 rounded-3xl flex flex-col relative shadow-xl transition-all duration-700 ${getOpacity('tech')} ${state.orderStatus === 'in_progress' ? 'flex-[4]' : 'flex-[2]'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 px-4 py-1 text-[10px] font-bold tracking-widest text-white rounded-b-lg uppercase">iPad Pro</div>

              <div className="p-4 pt-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="text-sm font-medium text-gray-600">Bay #2 (Lift)</div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${state.orderStatus === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                {state.orderStatus === 'in_progress' ? 'In Progress' : 'Available'}
              </span>
              </div>

              <div className="flex-1 flex p-6 gap-6 overflow-hidden">
                <div className="flex-[2] flex flex-col justify-center relative">

                  {/* Empty State */}
                  <AnimatePresence>
                    {!state.techTaskVisible && (
                        <motion.div exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                          <Wrench className="w-12 h-12 mb-4 opacity-20" />
                          <h3 className="text-lg font-medium text-gray-600">No Active Tasks</h3>
                          <p className="text-sm mt-2 text-gray-500">Waiting for assignment from administrator</p>
                        </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Task State */}
                  <AnimatePresence>
                    {state.techTaskVisible && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h2 className="text-2xl font-bold mb-1 text-gray-900">BMW X5 (А123ВС)</h2>
                              <span className="text-amber-600 text-sm flex items-center gap-1"><Info className="w-4 h-4"/> Brake grinding noise</span>
                            </div>
                          </div>

                          {/* Intake Photos Section */}
                          {!state.intakePhotosComplete && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-xl p-4"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Camera className="w-5 h-5 text-blue-600" />
                                <span className="font-bold text-blue-900">Vehicle Intake Photos</span>
                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">Required</span>
                              </div>
                              <p className="text-xs text-blue-800 mb-3">
                                Document vehicle condition before starting work
                              </p>

                              {state.intakePhotos.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                  {state.intakePhotos.map((photo, idx) => (
                                    <img key={idx} src={photo} alt={`Intake ${idx + 1}`} className="w-full aspect-square rounded-lg object-cover border-2 border-blue-200" />
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-2">
                                <button
                                  onClick={handleIntakePhoto}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                >
                                  <Camera className="w-4 h-4" />
                                  Take Photo ({state.intakePhotos.length}/4)
                                </button>
                                {state.intakePhotos.length >= 3 && (
                                  <button
                                    onClick={handleCompleteIntakePhotos}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all"
                                  >
                                    ✓ Complete
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}

                          <div className="space-y-3 mb-6 flex-1">
                            {[
                              { id: 1, label: "Brake system diagnostics" },
                              { id: 2, label: "Replace front brake pads" },
                              ...state.additionalTasks
                                .filter(t => t.approved)
                                .map((t, idx) => ({
                                  id: 100 + idx,
                                  label: `${t.description} (+${t.estimatedCost} Kč)`,
                                  isAdditional: true
                                }))
                            ].map((item, idx) => {
                              const isChecked = state.checksCompleted > idx;
                              return (
                                  <div key={item.id} onClick={handleTechCheck} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${isChecked ? 'bg-emerald-50 border-emerald-200 text-gray-600 line-through' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm'} ${item.isAdditional ? 'border-l-4 border-l-amber-500' : ''}`}>
                                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isChecked ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                                      {isChecked && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className="flex-1">
                                      {item.label}
                                      {item.isAdditional && (
                                        <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Additional</span>
                                      )}
                                    </div>
                                  </div>
                              )
                            })}
                          </div>

                          {/* Report Additional Issue Button */}
                          {state.intakePhotosComplete && state.orderStatus !== 'done' && (
                            <button
                              onClick={handleOpenAdditionalTaskModal}
                              className="w-full py-3 mb-3 border-2 border-amber-300 bg-amber-50 text-amber-900 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                            >
                              <AlertCircle className="w-5 h-5" />
                              Report Additional Issue
                            </button>
                          )}

                          <button
                              disabled={(() => {
                                const totalTasks = 2 + state.additionalTasks.filter(t => t.approved).length;
                                return !state.intakePhotosComplete || state.checksCompleted < totalTasks || state.orderStatus === 'done';
                              })()}
                              onClick={handleTechComplete}
                              className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                state.orderStatus === 'done'
                                  ? 'bg-emerald-600 text-white'
                                  : (() => {
                                      const totalTasks = 2 + state.additionalTasks.filter(t => t.approved).length;
                                      return state.intakePhotosComplete && state.checksCompleted >= totalTasks;
                                    })()
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                          >
                            {state.orderStatus === 'done' ? <><CheckCircle className="w-5 h-5"/> Work Completed</> : 'Complete Service'}
                          </button>
                        </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Tech Sidebar */}
                {state.techTaskVisible && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-5 shrink-0">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Information</div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Standard Time</div>
                          <div className="font-semibold text-sm text-gray-900">1.5 labor hours</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Parts</div>
                          <div className="font-semibold text-sm text-emerald-700 bg-emerald-100 inline-block px-2 py-1 rounded">Issued from warehouse</div>
                        </div>
                      </div>
                    </motion.div>
                )}
              </div>

              {/* Additional Task Modal */}
              <AnimatePresence>
                {state.showAdditionalTaskModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
                    onClick={handleCloseAdditionalTaskModal}
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
                          <h3 className="text-xl font-bold text-gray-900 mb-1">Report Additional Issue</h3>
                          <p className="text-sm text-gray-600">
                            Describe the issue found and estimated cost for client approval
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Issue Description
                          </label>
                          <textarea
                            value={state.additionalTaskDraft}
                            onChange={(e) => setState(prev => ({ ...prev, additionalTaskDraft: e.target.value }))}
                            placeholder="e.g., Found worn brake rotors that need replacement..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                            autoFocus
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Estimated Cost (Kč)
                          </label>
                          <input
                            type="number"
                            value={state.additionalTaskCostDraft}
                            onChange={(e) => setState(prev => ({ ...prev, additionalTaskCostDraft: e.target.value }))}
                            placeholder="e.g., 2500"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleCloseAdditionalTaskModal}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitAdditionalTask}
                          disabled={!state.additionalTaskDraft?.trim() || !state.additionalTaskCostDraft?.trim()}
                          className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Send to Client
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </main>
      </div>
  );
}
