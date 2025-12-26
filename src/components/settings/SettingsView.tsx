import React, { useState } from "react";

interface SettingsViewProps {
  onBack: () => void;
  onNavigate?: (view: "profile") => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    dashboardNotifications: true,
    weeklyEmailReports: true,
    systemAlerts: true,
    loginAlerts: false,
  });

  const toggleAccountSetting = (key: keyof typeof accountSettings) => {
    setAccountSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleNotificationSetting = (
    key: keyof typeof notificationSettings
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Header */}
      <div className="flex md:items-center items-start justify-between">
        <div className="flex items-start gap-4 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <p className="font-normal md:text-sm text-xs">Back</p>
          </button>
          <div>
            <h1 className="md:text-2xl font-normal text-gray-900">Settings</h1>
            <p className="text-gray-500 md:text-sm text-xs">
              Manage your account preferences and system configuration
            </p>
          </div>
        </div>
        <button className="md:px-6 py-2.5 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity md:text-sm text-xs font-medium">
          Save All Settings
        </button>
      </div>

      {/* Account Settings */}
      <h3 className="md:text-lg font-semibold text-gray-900 my-1">
        Account Settings
      </h3>
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
        {/* Two Factor Authentication */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Two Factor Authentication
            </h4>
            <p className="text-xs text-gray-500">
              Add an extra layer to your account
            </p>
          </div>
          <button
            onClick={() => toggleAccountSetting("twoFactorAuth")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              accountSettings.twoFactorAuth ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                accountSettings.twoFactorAuth
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Email Notifications
            </h4>
            <p className="text-xs text-gray-500">
              Receive notification via email
            </p>
          </div>
          <button
            onClick={() => toggleAccountSetting("emailNotifications")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              accountSettings.emailNotifications ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                accountSettings.emailNotifications
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              SMS Notifications
            </h4>
            <p className="text-xs text-gray-500">
              Receive notification via SMS
            </p>
          </div>
          <button
            onClick={() => toggleAccountSetting("smsNotifications")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              accountSettings.smsNotifications ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                accountSettings.smsNotifications
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <h3 className="md:text-lg font-semibold text-gray-900 my-1">
        Notification Settings
      </h3>
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
        {/* Dashboard Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Dashboard Notifications
            </h4>
            <p className="text-xs text-gray-500">
              Show notifications in the dashboard
            </p>
          </div>
          <button
            onClick={() => toggleNotificationSetting("dashboardNotifications")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.dashboardNotifications
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.dashboardNotifications
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Weekly Email Reports */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Weekly Email Reports
            </h4>
            <p className="text-xs text-gray-500">
              Receive weekly summary reports via email
            </p>
          </div>
          <button
            onClick={() => toggleNotificationSetting("weeklyEmailReports")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.weeklyEmailReports
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.weeklyEmailReports
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* System Alerts */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              System Alerts
            </h4>
            <p className="text-xs text-gray-500">
              Receive critical system alerts
            </p>
          </div>
          <button
            onClick={() => toggleNotificationSetting("systemAlerts")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.systemAlerts ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.systemAlerts
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Login Alerts via Mail */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Login Alerts wia Mail
            </h4>
            <p className="text-xs text-gray-500">
              Get notified when new Login register
            </p>
          </div>
          <button
            onClick={() => toggleNotificationSetting("loginAlerts")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.loginAlerts ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.loginAlerts
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
