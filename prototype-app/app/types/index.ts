export type OrderStatus = "new" | "accepted" | "in_progress" | "done";
export type AdminView = "requests" | "schedule" | "clients";
export type ClientView = "form" | "tracking";

export interface Part {
  id: string;
  name: string;
  available: boolean;
  quantity: number;
  price: number;
  estimatedDelivery?: string;
}

export interface StandardService {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  requiredBay: string;
  requiredMechanic: string;
  requiredParts: string[];
}

export interface ServiceHistory {
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

export interface Bay {
  id: string;
  name: string;
  available: boolean;
  currentJob?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  currentJob?: string;
  rating: number;
}

export interface AdditionalTask {
  id: string;
  description: string;
  estimatedCost: number;
  approved: boolean;
  declined: boolean;
  hoursSpent?: number; // Часы, потраченные механиком на задачу
  completed?: boolean;
  sentToAdmin?: boolean;
  sentToClient?: boolean;
}

export interface Order {
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
  prefersOriginalParts?: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  vin: string;
  lastVisit: string;
  totalOrders: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  vehicle: string;
  vin: string;
  clientName: string;
  service: string;
  duration: string;
  status: "scheduled" | "in_progress" | "completed";
}

export interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  confirmBy?: string;
}

export interface LoggedInMechanic {
  mechanicId: string;
  loginTime: string;
}

export interface SystemState {
  step: number;
  orderStatus: OrderStatus;
  clientHasNotif: boolean;
  techTaskVisible: boolean;
  checksCompleted: number;
  focusedRole: "all" | "admin" | "tech" | "client";
  adminView: AdminView;
  clientView: ClientView;
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
    photos: string[];
    selectedServices: string[];
    prefersOriginalParts: boolean;
    clientName: string;
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
  loggedInMechanics: LoggedInMechanic[];
  currentMechanicView: string | null;
  workStartTime: number | null;
  workElapsedSeconds: number;
  selectedClientId: string | null;
}
