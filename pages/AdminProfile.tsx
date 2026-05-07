import React, { useState } from "react";
import { useDynamicTitle } from "../hooks/useDynamicTitle";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import AdminHeader from "../components/admin/AdminHeader";
import AdminStatCards from "../components/admin/AdminStatCards";
import AdminTabs from "../components/admin/AdminTabs";
import AdminControlsBar from "../components/admin/AdminControlsBar";
import AdminConfirmBanner from "../components/admin/AdminConfirmBanner";
import AdminDataView from "../components/admin/AdminDataView";
import AdminSkeleton from "../components/skeleton-loaders/admin/AdminSkeleton";
import Admin2FASetup from "../components/admin/Admin2FASetup";
import { useAuth } from "@/context/AuthContext";

const AdminProfile: React.FC = () => {
  useDynamicTitle("Admin Dashboard");
  const dash = useAdminDashboard();
  const { twoFactorEnabled, twoFactorMethod } = useAuth();

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  if (!dash.stats && dash.loading) return <AdminSkeleton />;

  const handleShowSettings = () => {
    setShowSettingsModal(true);
  };

  const handleCloseSettings = () => {
    setShowSettingsModal(false);
  };

  return (
    <div className="pt-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminHeader
          adminEmail={dash.adminEmail}
          onLogout={dash.handleLogout}
          showSettings={handleShowSettings}
        />

        {/* 2FA Setup Section */}
        <div className="mb-12">
          <Admin2FASetup
            twoFactorEnabled={twoFactorEnabled}
            twoFactorMethod={twoFactorMethod}
            onStartSetup={handleShowSettings}
            onCancelSetup={handleCloseSettings}
            showSettings={showSettingsModal}
          />
        </div>

        {dash.stats && <AdminStatCards stats={dash.stats} />}

        <AdminTabs
          activeTab={dash.activeTab}
          onTabChange={dash.setActiveTab}
          getBadge={dash.getBadge}
        />

        <AdminControlsBar
          search={dash.search}
          onSearchChange={dash.setSearch}
          timeRange={dash.timeRange}
          onTimeRangeChange={dash.setTimeRange}
          viewMode={dash.viewMode}
          onViewModeChange={dash.setViewMode}
          onRefresh={() => {
            dash.fetchTab(dash.activeTab);
            dash.fetchStats();
          }}
          selectedSize={dash.selected.size}
          onDeleteSelected={() => dash.setConfirmClear("selected")}
          onClearAll={() => dash.setConfirmClear("all")}
        />

        {dash.confirmClear && (
          <AdminConfirmBanner
            confirmClear={dash.confirmClear}
            rowCount={dash.rows.length}
            selectedSize={dash.selected.size}
            deleting={dash.deleting}
            onCancel={() => dash.setConfirmClear(null)}
            onConfirm={() =>
              dash.confirmClear === "all"
                ? dash.doDelete()
                : dash.doDelete(Array.from(dash.selected) as number[])
            }
          />
        )}

        <AdminDataView
          loading={dash.loading}
          rows={dash.rows}
          filteredRows={dash.filteredRows}
          viewMode={dash.viewMode}
          selected={dash.selected}
          allSelected={dash.allSelected}
          onToggleSelect={dash.toggleSelect}
          onToggleSelectAll={dash.toggleSelectAll}
        />

        {dash.filteredRows.length > 0 && (
          <p className="mt-4 text-xs text-text-muted text-right">
            Showing {dash.filteredRows.length} of {dash.rows.length} records
            {dash.selected.size > 0 && ` · ${dash.selected.size} selected`}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
