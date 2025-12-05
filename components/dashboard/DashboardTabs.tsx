"use client";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardTabs({
  activeTab,
  onTabChange,
}: DashboardTabsProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analytics", label: "Analytics" },
    { id: "absensi", label: "Absensi" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "quiz", label: "Kuis" },
  ];

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
