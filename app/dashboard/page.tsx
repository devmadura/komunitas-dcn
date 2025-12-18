"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Kontributor, Pertemuan } from "@/lib/supabase";
import { Admin } from "@/lib/permissions";
import {
  DashboardHeader,
  DashboardTabs,
  DashboardStats,
  AnalyticsTab,
  AbsensiTab,
  LeaderboardTab,
  QuizTab,
} from "@/components/dashboard";
import ManageAdminTab from "@/components/dashboard/ManageAdminTab";
import ActivityLogTab from "@/components/dashboard/ActivityLogTab";
import AccountSettingsTab from "@/components/dashboard/AccountSettingsTab";
import CodeRedeemTab from "@/components/dashboard/CodeRedeemTab";
import EventsTab from "@/components/dashboard/EventsTab";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [kontributor, setKontributor] = useState<Kontributor[]>([]);
  const [pertemuan, setPertemuan] = useState<Pertemuan[]>([]);
  const [absensiCount, setAbsensiCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    fetchData();
    fetchCurrentAdmin();
  }, []);

  const fetchCurrentAdmin = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        // Tidak ada akses, redirect ke login
        router.push("/login");
        return;
      }
      const data = await response.json();
      setCurrentAdmin(data.admin);
    } catch (error) {
      console.error("Error fetching current admin:", error);
      router.push("/login");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kontributorRes, pertemuanRes, absensiRes] = await Promise.all([
        fetch("/api/kontributor"),
        fetch("/api/pertemuan"),
        fetch("/api/absensi"),
      ]);

      const kontributorData = await kontributorRes.json();
      const pertemuanData = await pertemuanRes.json();
      const absensiData = await absensiRes.json();

      setKontributor(Array.isArray(kontributorData) ? kontributorData : []);
      setPertemuan(Array.isArray(pertemuanData) ? pertemuanData : []);
      setAbsensiCount(Array.isArray(absensiData) ? absensiData.length : 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setKontributor([]);
      setPertemuan([]);
      setAbsensiCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <DashboardHeader onLogout={handleLogout} loggingOut={loggingOut} currentAdmin={currentAdmin} />
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} currentAdmin={currentAdmin} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <DashboardStats
            kontributor={kontributor}
            pertemuan={pertemuan}
            absensiCount={absensiCount}
          />
        )}

        {activeTab === "analytics" && <AnalyticsTab />}

        {activeTab === "absensi" && (
          <AbsensiTab
            pertemuan={pertemuan}
            kontributor={kontributor}
            onDataChanged={fetchData}
          />
        )}

        {activeTab === "leaderboard" && (
          <LeaderboardTab kontributor={kontributor} onRefresh={fetchData} />
        )}

        {activeTab === "quiz" && <QuizTab onDataChanged={fetchData} />}

        {activeTab === "code-redeem" && <CodeRedeemTab onDataChanged={fetchData} />}

        {activeTab === "events" && <EventsTab onDataChanged={fetchData} />}

        {activeTab === "manage-admin" && (
          <ManageAdminTab currentAdmin={currentAdmin} />
        )}

        {activeTab === "activity-log" && <ActivityLogTab />}

        {activeTab === "account-settings" && (
          <AccountSettingsTab currentAdmin={currentAdmin} onAdminUpdated={fetchCurrentAdmin} />
        )}
      </div>
    </div>
  );
}
