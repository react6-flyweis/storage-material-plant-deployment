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
import AllProjectsView from "./components/projects/AllProjectsView";
import ProjectDetailsView from "./components/projects/ProjectDetailsView";
import BOMView from "./components/projects/BOMView";
import GenerateShipperOrder from "./components/projects/GenerateShipperOrder";
import ProjectDrawingsView from "./components/projects/ProjectDrawingsView";
import MaterialDeliveryView from "./components/projects/MaterialDeliveryView";
import EditDeliveryView from "./components/projects/EditDeliveryView";
import ShipperFilesView from "./components/projects/ShipperFilesView";
import ShipperFileDetailsView from "./components/projects/ShipperFileDetailsView";
import MaterialRequestView from "./components/projects/MaterialRequestView";
import UploadedBOMFilesView from "./components/projects/UploadedBOMFilesView";
import ShipperQuotationView from "./components/projects/ShipperQuotationView";
import OrderVerificationView from "./components/projects/OrderVerificationView";
import StartLoadPlanningView from "./components/projects/StartLoadPlanningView";
import ComparisonResultView from "./components/projects/ComparisonResultView";
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
        path: "/projects/all-projects/:id",
        element: <AllProjectsView />,
      },
      {
        path: "/projects/project-details/:customerId/:projectId",
        element: <ProjectDetailsView />,
      },
      {
        path: "/projects/view-bom/:customerId/:projectId",
        element: <BOMView />,
      },
      {
        path: "/projects/generate-shipper-order/:customerId/:projectId",
        element: <GenerateShipperOrder />,
      },
      {
        path: "/projects/view-drawings/:customerId/:projectId",
        element: <ProjectDrawingsView />,
      },
      {
        path: "/projects/material-delivery/:customerId/:projectId",
        element: <MaterialDeliveryView />,
      },
      {
        path: "/projects/material-delivery/:customerId/:projectId/edit",
        element: <EditDeliveryView />,
      },
      {
        path: "/projects/shipper-files/:customerId/:projectId",
        element: <ShipperFilesView />,
      },
      {
        path: "/projects/shipper-file-details/:customerId/:projectId/:fileName",
        element: <ShipperFileDetailsView />,
      },
      {
        path: "/projects/material-request/:customerId/:projectId",
        element: <MaterialRequestView />,
      },
      {
        path: "/load_planning/uploaded-bom-files",
        element: <UploadedBOMFilesView />,
      },
      {
        path: "/load_planning/shipper-quotation",
        element: <ShipperQuotationView />,
      },
      {
        path: "/load_planning/order-verification",
        element: <OrderVerificationView />,
      },
      {
        path: "/load_planning/comparison-result",
        element: <ComparisonResultView />,
      },
      {
        path: "/load_planning/start-load-planning",
        element: <StartLoadPlanningView />,
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
