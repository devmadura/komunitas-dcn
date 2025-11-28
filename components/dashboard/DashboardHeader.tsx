"use client";

import { Users, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
  loggingOut: boolean;
}

export default function DashboardHeader({
  onLogout,
  loggingOut,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard DCN</h1>
              <p className="text-sm text-gray-600">Sistem Absensi Kontributor</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">
              {loggingOut ? "Keluar..." : "Keluar"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
