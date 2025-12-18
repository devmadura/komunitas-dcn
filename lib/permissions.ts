export const PERMISSIONS = {
  DASHBOARD: "dashboard",
  ANALYTICS: "analytics",
  ABSENSI: "absensi",
  LEADERBOARD: "leaderboard",
  QUIZ: "quiz",
  KONTRIBUTOR: "kontributor",
  MANAGE_ADMIN: "manage_admin",
  ACTIVITY_LOG: "activity_log",
  CODE_REDEEM: "code_redeem",
  EVENTS: "events",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS: Record<Permission, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  absensi: "Absensi & Pertemuan",
  leaderboard: "Leaderboard",
  quiz: "Kuis",
  kontributor: "Kontributor",
  manage_admin: "Kelola Admin",
  activity_log: "Activity Log",
  code_redeem: "Code Redeem",
  events: "Events",
};

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export interface Admin {
  id: string;
  user_id: string | null;
  email: string;
  nama: string;
  role: "super-admin" | "co-admin";
  label: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export function hasPermission(
  admin: Admin | null,
  permission: Permission
): boolean {
  if (!admin) return false;
  if (admin.role === "super-admin") return true;
  return admin.permissions.includes(permission);
}

export function hasAnyPermission(
  admin: Admin | null,
  permissions: Permission[]
): boolean {
  if (!admin) return false;
  if (admin.role === "super-admin") return true;
  return permissions.some((p) => admin.permissions.includes(p));
}
