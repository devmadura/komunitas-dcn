"use client";

import { Admin, hasPermission, PERMISSIONS, Permission } from "@/lib/permissions";
import { 
  LayoutDashboard, 
  BarChart3, 
  ClipboardCheck, 
  Trophy, 
  HelpCircle, 
  Users, 
  Activity, 
  Settings,
  LucideIcon
} from "lucide-react";

interface Tab {
  id: string;
  label: string;
  permission: string | null;
  icon: LucideIcon;
}

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
  const allTabs: Tab[] = [
    { id: "dashboard", label: "Dashboard", permission: PERMISSIONS.DASHBOARD, icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", permission: PERMISSIONS.ANALYTICS, icon: BarChart3 },
    { id: "absensi", label: "Absensi", permission: PERMISSIONS.ABSENSI, icon: ClipboardCheck },
    { id: "leaderboard", label: "Leaderboard", permission: PERMISSIONS.LEADERBOARD, icon: Trophy },
    { id: "quiz", label: "Kuis", permission: PERMISSIONS.QUIZ, icon: HelpCircle },
    { id: "manage-admin", label: "Kelola Admin", permission: PERMISSIONS.MANAGE_ADMIN, icon: Users },
    { id: "activity-log", label: "Activity Log", permission: PERMISSIONS.ACTIVITY_LOG, icon: Activity },
    { id: "account-settings", label: "Pengaturan Akun", permission: null, icon: Settings },
  ];

  const tabs = currentAdmin
    ? allTabs.filter((tab) => tab.permission === null || hasPermission(currentAdmin, tab.permission as Permission))
    : allTabs.slice(0, 5);

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide -mb-px gap-1 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                  whitespace-nowrap transition-all duration-200 flex-shrink-0
                  ${isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
