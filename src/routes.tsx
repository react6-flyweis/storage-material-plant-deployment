import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { NotFound } from "@/pages/not-found";
import { MainLayout } from "@/components/main-layout";
import EquipmentView from "./components/EquipmentView";
import MaterialInventoryView from "./components/material_inventory_management/MaterialInventoryView";
import ProductionManagementView from "./components/ProductionManagementView";
import CommunicationView from "./components/communication/CommunicationView";
import MaintenanceAndSchedulingView from "./components/maintenance_and_scheduling/MaintenanceAndSchedulingView";
import UpcomingScheduleView from "./components/maintenance_and_scheduling/UpcomingScheduleView";
import BreakdownCasesView from "./components/maintenance_and_scheduling/BreakdownCasesView";
import ServiceProvidersView from "./components/maintenance_and_scheduling/ServiceProvidersView";
import EquipmentAllocationView from "./components/equipment_allocation/EquipmentAllocationView";
import TransferRequestsView from "./components/equipment_allocation/TransferRequestsView";
import SettingsView from "./components/settings/SettingsView";
import UsageTrackingView from "./components/equipment_allocation/UsageTrackingView";
import NotificationsView from "./components/notifications/NotificationsView";
import ProfileView from "./components/profile/ProfileView";
import CustomerInfoView from "./components/CustomerInfoView";
const Dashboard = lazy(() => import("@/pages/plantDashboard/PlantDashboard"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/equipment_management",
        element: <EquipmentView />,
      },
      {
        path: "/material_inventory_management",
        element: <MaterialInventoryView />,
      },
      {
        path: "/production_management",
        element: <ProductionManagementView />,
      },
      {
        path: "/projects",
        element: <ProductionManagementView />,
      },
      {
        path: "/projects/customerinfo/:id",
        element: <CustomerInfoView />,
      },
      {
        path: "/communication",
        element: <CommunicationView />,
      },
      {
        path: "/maintenance_logs",
        element: <MaintenanceAndSchedulingView />,
      },
      { path: "/upcoming_schedule", element: <UpcomingScheduleView /> },
      { path: "/breakdown_cases", element: <BreakdownCasesView /> },
      { path: "/service_providers", element: <ServiceProvidersView /> },
      {
        path: "/equipment_allocation",
        element: <EquipmentAllocationView />,
      },
      { path: "/transfer_requests", element: <TransferRequestsView /> },
      { path: "/usage_tracking", element: <UsageTrackingView /> },
      { path: "/notification", element: <NotificationsView /> },
      {
        path: "settings",
        element: <SettingsView />,
      },
      {
        path: "profile",
        element: <ProfileView />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];
