"use client";

import { Users, LogOut, Shield, User } from "lucide-react";
import { Admin } from "@/lib/permissions";

interface DashboardHeaderProps {
  onLogout: () => void;
  loggingOut: boolean;
  currentAdmin?: Admin | null;
}

export default function DashboardHeader({
  onLogout,
  loggingOut,
  currentAdmin,
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
          <div className="flex items-center space-x-4">
            {currentAdmin && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  {currentAdmin.role === "super-admin" ? (
                    <Shield className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <User className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentAdmin.nama}</p>
                  <p className="text-xs text-gray-500">
                    {currentAdmin.role === "super-admin" ? "Super Admin" : "Co-Admin"}
                  </p>
                </div>
              </div>
            )}
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
    </div>
  );
}
