import { Part, TimeSlot, StandardService, ServiceHistory, Bay, Mechanic, Order, Client, ScheduleItem } from "../types";

export const mockParts: Part[] = [
  { id: "1", name: "Front Brake Pads", available: true, quantity: 4, price: 2800, estimatedDelivery: undefined },
  { id: "2", name: "Brake Fluid", available: true, quantity: 10, price: 400, estimatedDelivery: undefined },
  { id: "3", name: "Brake Discs", available: false, quantity: 0, price: 5600, estimatedDelivery: "2026-05-11" },
];

export const mockTimeSlots: TimeSlot[] = [
  // May 10
  { id: "1", time: "09:00 AM", date: "2026-05-10", available: true },
  { id: "2", time: "11:00 AM", date: "2026-05-10", available: true },
  { id: "3", time: "02:00 PM", date: "2026-05-10", available: false },
  { id: "4", time: "04:00 PM", date: "2026-05-10", available: true },
  // May 11
  { id: "5", time: "09:00 AM", date: "2026-05-11", available: true },
  { id: "6", time: "10:00 AM", date: "2026-05-11", available: true },
  { id: "7", time: "01:00 PM", date: "2026-05-11", available: false },
  { id: "8", time: "03:00 PM", date: "2026-05-11", available: true },
  // May 12
  { id: "9", time: "08:00 AM", date: "2026-05-12", available: true },
  { id: "10", time: "11:00 AM", date: "2026-05-12", available: true },
  { id: "11", time: "02:00 PM", date: "2026-05-12", available: true },
  // May 13
  { id: "12", time: "09:00 AM", date: "2026-05-13", available: true },
  { id: "13", time: "03:00 PM", date: "2026-05-13", available: true },
  // May 14
  { id: "14", time: "10:00 AM", date: "2026-05-14", available: true },
  { id: "15", time: "01:00 PM", date: "2026-05-14", available: false },
  { id: "16", time: "04:00 PM", date: "2026-05-14", available: true },
  // May 15
  { id: "17", time: "09:00 AM", date: "2026-05-15", available: true },
  { id: "18", time: "11:00 AM", date: "2026-05-15", available: true },
  // May 16-17 (weekend - fewer slots)
  { id: "19", time: "10:00 AM", date: "2026-05-16", available: true },
  { id: "20", time: "10:00 AM", date: "2026-05-17", available: true },
  // May 18
  { id: "21", time: "08:00 AM", date: "2026-05-18", available: true },
  { id: "22", time: "02:00 PM", date: "2026-05-18", available: true },
  // May 19
  { id: "23", time: "09:00 AM", date: "2026-05-19", available: true },
  { id: "24", time: "11:00 AM", date: "2026-05-19", available: false },
  { id: "25", time: "03:00 PM", date: "2026-05-19", available: true },
  // May 20
  { id: "26", time: "10:00 AM", date: "2026-05-20", available: true },
  { id: "27", time: "01:00 PM", date: "2026-05-20", available: true },
  // May 21
  { id: "28", time: "09:00 AM", date: "2026-05-21", available: true },
  { id: "29", time: "04:00 PM", date: "2026-05-21", available: true },
  // May 22
  { id: "30", time: "08:00 AM", date: "2026-05-22", available: true },
  { id: "31", time: "11:00 AM", date: "2026-05-22", available: true },
  { id: "32", time: "02:00 PM", date: "2026-05-22", available: false },
];

export const mockStandardServices: StandardService[] = [
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

export const mockServiceHistory: ServiceHistory[] = [
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

export const mockBays: Bay[] = [
  { id: "bay1", name: "Bay 1 (Lift A)", available: true },
  { id: "bay2", name: "Bay 2 (Lift B)", available: true },
  { id: "bay3", name: "Bay 3 (Lift C)", available: false, currentJob: "Oil change in progress" },
  { id: "bay4", name: "Bay 4 (Alignment)", available: true },
];

export const mockMechanics: Mechanic[] = [
  { id: "mech1", name: "Jan Novák", specialty: "Brakes & Suspension", available: true, rating: 4.9 },
  { id: "mech2", name: "Petra Svobodová", specialty: "Engine & Transmission", available: true, rating: 4.8 },
  { id: "mech3", name: "Tomáš Dvořák", specialty: "Electrical & Diagnostics", available: false, currentJob: "Working on Bay 3", rating: 4.7 },
  { id: "mech4", name: "Lucie Procházková", specialty: "General Maintenance", available: true, rating: 4.6 },
];

export const mockOrders: Order[] = [
  { id: "1", vehicle: "BMW X5", vin: "5UXKR0C58L9C12345", issue: "Grinding noise when braking", status: "new", clientName: "Petr Černý", phone: "+420 777 123 456", scheduledTime: "10:00 AM" },
  { id: "2", vehicle: "Mercedes C-Class", vin: "WDDGF8AB9EA123456", issue: "Engine check light", status: "accepted", clientName: "Jana Horáková", phone: "+420 777 234 567", scheduledTime: "11:30 AM" },
  { id: "3", vehicle: "Audi A4", vin: "WAUZZZ8K8DA234567", issue: "Oil change service", status: "in_progress", clientName: "Martin Kučera", phone: "+420 777 345 678", scheduledTime: "09:00 AM" },
  { id: "4", vehicle: "Tesla Model 3", vin: "5YJ3E1EA8KF345678", issue: "Tire rotation", status: "done", clientName: "Eva Marková", phone: "+420 777 456 789", scheduledTime: "08:00 AM" },
];

export const mockClients: Client[] = [
  { id: "1", name: "Petr Černý", phone: "+420 777 123 456", email: "petr.cerny@email.cz", vehicle: "BMW X5", vin: "5UXKR0C58L9C12345", lastVisit: "2026-05-09", totalOrders: 12 },
  { id: "2", name: "Jana Horáková", phone: "+420 777 234 567", email: "jana.horakova@email.cz", vehicle: "Mercedes C-Class", vin: "WDDGF8AB9EA123456", lastVisit: "2026-05-08", totalOrders: 8 },
  { id: "3", name: "Martin Kučera", phone: "+420 777 345 678", email: "martin.kucera@email.cz", vehicle: "Audi A4", vin: "WAUZZZ8K8DA234567", lastVisit: "2026-05-09", totalOrders: 15 },
  { id: "4", name: "Eva Marková", phone: "+420 777 456 789", email: "eva.markova@email.cz", vehicle: "Tesla Model 3", vin: "5YJ3E1EA8KF345678", lastVisit: "2026-05-09", totalOrders: 5 },
  { id: "5", name: "David Veselý", phone: "+420 777 567 890", email: "david.vesely@email.cz", vehicle: "Toyota Camry", vin: "4T1BF1FK8CU456789", lastVisit: "2026-05-07", totalOrders: 20 },
  { id: "6", name: "Lucie Němcová", phone: "+420 777 678 901", email: "lucie.nemcova@email.cz", vehicle: "Honda Accord", vin: "1HGCV1F30JA567890", lastVisit: "2026-05-06", totalOrders: 10 },
];

export const mockSchedule: ScheduleItem[] = [
  { id: "1", time: "08:00 AM", vehicle: "Tesla Model 3", vin: "5YJ3E1EA8KF345678", clientName: "Eva Marková", service: "Tire rotation", duration: "1h", status: "completed" },
  { id: "2", time: "09:00 AM", vehicle: "Audi A4", vin: "WAUZZZ8K8DA234567", clientName: "Martin Kučera", service: "Oil change service", duration: "1.5h", status: "in_progress" },
  { id: "3", time: "10:00 AM", vehicle: "BMW X5", vin: "A123BC", clientName: "Petr Černý", service: "Brake system repair", duration: "2h", status: "scheduled" },
  { id: "4", time: "11:30 AM", vehicle: "Mercedes C-Class", vin: "B456DE", clientName: "Jana Horáková", service: "Engine diagnostics", duration: "1h", status: "scheduled" },
  { id: "5", time: "01:00 PM", vehicle: "Toyota Camry", vin: "E345JK", clientName: "David Veselý", service: "Full inspection", duration: "2h", status: "scheduled" },
  { id: "6", time: "03:00 PM", vehicle: "Honda Accord", vin: "F678LM", clientName: "Lucie Němcová", service: "AC repair", duration: "1.5h", status: "scheduled" },
];
