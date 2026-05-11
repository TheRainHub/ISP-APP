export function getOpacity(focusedRole: "all" | "admin" | "tech" | "client", role: "admin" | "tech" | "client", appointmentNotif: boolean, appointmentConfirmed: boolean) {
  if (focusedRole === "all") return "opacity-100";
  if (role === "client" && appointmentNotif && !appointmentConfirmed) return "opacity-100";
  if (focusedRole === "admin" && role !== "admin") return "opacity-40";
  if (focusedRole === "tech" && role !== "tech") return "opacity-40";
  if (focusedRole === "client" && role !== "client") return "opacity-40";
  return "opacity-100";
}
