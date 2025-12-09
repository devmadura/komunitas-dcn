"use client";

import { Admin, hasPermission, PERMISSIONS } from "@/lib/permissions";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentAdmin?: Admin | null;
}

export default function DashboardTabs({
  activeTab,
  onTabChange,
  currentAdmin,
}: DashboardTabsProps) {
  const allTabs = [
    { id: "dashboard", label: "Dashboard", permission: PERMISSIONS.DASHBOARD },
    { id: "analytics", label: "Analytics", permission: PERMISSIONS.ANALYTICS },
    { id: "absensi", label: "Absensi", permission: PERMISSIONS.ABSENSI },
    { id: "leaderboard", label: "Leaderboard", permission: PERMISSIONS.LEADERBOARD },
    { id: "quiz", label: "Kuis", permission: PERMISSIONS.QUIZ },
    { id: "manage-admin", label: "Kelola Admin", permission: PERMISSIONS.MANAGE_ADMIN },
    { id: "activity-log", label: "Activity Log", permission: PERMISSIONS.ACTIVITY_LOG },
  ];

  const tabs = currentAdmin
    ? allTabs.filter((tab) => hasPermission(currentAdmin, tab.permission))
    : allTabs.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
