import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

import { NotFound } from "@/pages/not-found";
import { MainLayout } from "@/components/main-layout";
import ErrorPage from "@/pages/ErrorPage";
import {
  RedirectIfAuthenticated,
  RequireAuth,
  RootRedirect,
} from "@/components/route-auth";

const Login = lazy(() => import("@/pages/Login"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));

const Dashboard = lazy(() => import("@/pages/plantDashboard/PlantDashboard"));
const EquipmentView = lazy(() => import("./components/EquipmentView"));
const MaterialInventoryView = lazy(
  () =>
    import("./components/material_inventory_management/MaterialInventoryView"),
);
const ProductionManagementView = lazy(
  () => import("./components/ProductionManagementView"),
);
const CommunicationView = lazy(
  () => import("./components/communication/CommunicationView"),
);
const MaintenanceAndSchedulingView = lazy(
  () =>
    import("./components/maintenance_and_scheduling/MaintenanceAndSchedulingView"),
);
const UpcomingScheduleView = lazy(
  () => import("./components/maintenance_and_scheduling/UpcomingScheduleView"),
);
const BreakdownCasesView = lazy(
  () => import("./components/maintenance_and_scheduling/BreakdownCasesView"),
);
const ServiceProvidersView = lazy(
  () => import("./components/maintenance_and_scheduling/ServiceProvidersView"),
);
const EquipmentAllocationView = lazy(
  () => import("./components/equipment_allocation/EquipmentAllocationView"),
);
const TransferRequestsView = lazy(
  () => import("./components/equipment_allocation/TransferRequestsView"),
);
const SettingsView = lazy(() => import("./components/settings/SettingsView"));
const UsageTrackingView = lazy(
  () => import("./components/equipment_allocation/UsageTrackingView"),
);
const NotificationsView = lazy(
  () => import("./components/notifications/NotificationsView"),
);
const ProfileView = lazy(() => import("./components/profile/ProfileView"));
const CustomerInfoView = lazy(() => import("./components/CustomerInfoView"));
const AllProjectsView = lazy(
  () => import("./components/projects/AllProjectsView"),
);
const ProjectDetailsView = lazy(
  () => import("./components/projects/ProjectDetailsView"),
);
const BOMView = lazy(() => import("./components/projects/BOMView"));
const GenerateShipperOrder = lazy(
  () => import("./components/projects/GenerateShipperOrder"),
);
const ProjectDrawingsView = lazy(
  () => import("./components/projects/ProjectDrawingsView"),
);
const EditDeliveryView = lazy(
  () => import("./components/projects/EditDeliveryView"),
);
const ShipperFilesView = lazy(
  () => import("./components/projects/ShipperFilesView"),
);
const ShipperFileDetailsView = lazy(
  () => import("./components/projects/ShipperFileDetailsView"),
);
const MaterialRequestView = lazy(
  () => import("./components/projects/MaterialRequestView"),
);
const UploadedBOMFilesView = lazy(
  () => import("./components/projects/UploadedBOMFilesView"),
);
const ShipperQuotationView = lazy(
  () => import("./components/projects/ShipperQuotationView"),
);
const OrderVerificationView = lazy(
  () => import("./components/projects/OrderVerificationView"),
);
const StartLoadPlanningView = lazy(
  () => import("./components/projects/StartLoadPlanningView"),
);
const ProjectLoadPlanningView = lazy(
  () => import("./components/projects/ProjectLoadPlanningView"),

)
const ShipperUploadView = lazy(
  () => import("./components/projects/load_planning_pages/ShipperUploadView"),
);
const ItemAnalysisView = lazy(
  () => import("./components/projects/load_planning_pages/ItemAnalysisView"),
);
const BundlePlannerView = lazy(
  () => import("./components/projects/load_planning_pages/BundlePlannerView"),
);
const EditBundleView = lazy(
  () => import("./components/projects/load_planning_pages/EditBundleView"),
);
const TruckOptimizerView = lazy(
  () => import("./components/projects/load_planning_pages/TruckOptimizerView"),
);
const PackingListViewPage = lazy(
  () => import("./components/projects/load_planning_pages/PackingListViewPage"),
);
const QRLabelView = lazy(
  () => import("./components/projects/load_planning_pages/QRLabelView"),
);
const LoadPlanReviewView = lazy(
  () => import("./components/projects/load_planning_pages/LoadPlanReviewView"),
);
const FreightSelectionView = lazy(
  () => import("./components/projects/load_planning_pages/FreightSelectionView"),
);
const ComparisonResultView = lazy(
  () => import("./components/projects/ComparisonResultView"),
);
const LoadPlanningList = lazy(
  () => import("./components/projects/LoadPlanningList"),
);
const ProjectLoadPlansList = lazy(
  () => import("./components/projects/ProjectLoadPlansList"),
);
const PackingListView = lazy(
  () => import("./components/projects/PackingListView"),
);
const ProjectPackingList = lazy(
  () => import("./components/projects/ProjectPackingList"),
);
const LoadPlanDetailsView = lazy(
  () => import("./components/projects/LoadPlanDetailsView"),
);
const PackingListDetailsView = lazy(
  () => import("./components/projects/PackingListDetailsView"),
);
const QRLabelsView = lazy(() => import("./components/projects/QRLabelsView"));
const ProjectQRLabels = lazy(
  () => import("./components/projects/ProjectQRLabels"),
);
const PackingListQRLabels = lazy(
  () => import("./components/projects/PackingListQRLabels"),
);
const FreightLoadsView = lazy(
  () => import("./components/delivery/FreightLoadsView"),
);
const AwardedLoadsView = lazy(
  () => import("./components/delivery/AwardedLoadsView"),
);
const FreightRequestDetailsView = lazy(
  () => import("./components/delivery/FreightRequestDetailsView"),
);
const DeliveryDetailsView = lazy(
  () => import("./components/delivery/DeliveryDetailsView"),
);
const MaterialDeliveryView = lazy(
  () => import("./components/delivery/MaterialDeliveryView"),
);
const FreightLoadDetailsView = lazy(
  () => import("./components/delivery/FreightLoadDetailsView"),
);
const DeliveryCalendarView = lazy(
  () => import("./components/delivery/DeliveryCalendarView"),
);
const AllDeliveriesView = lazy(
  () => import("./components/delivery/AllDeliveriesView"),
);
const DeliveryNotificationsView = lazy(
  () => import("./components/delivery/DeliveryNotificationsView"),
);
const CostingView = lazy(() => import("./components/costing/CostingView"));
const LogisticsView = lazy(
  () => import("./components/logistics/LogisticsView"),
);
const AddNewShipper = lazy(
  () => import("./components/logistics/AddNewShipper"),
);
const EditShipper = lazy(
  () => import("./components/logistics/EditShipper"),
);
const VendorDetailsView = lazy(
  () => import("./components/logistics/VendorDetailsView"),
);
const FreightCarriersView = lazy(
  () => import("./components/logistics/FreightCarriersView"),
);
const AddNewFreightCourier = lazy(
  () => import("./components/logistics/AddNewFreightCourier"),
);
const CarrierDetailsView = lazy(
  () => import("./components/logistics/CarrierDetailsView"),
);
const EditFreightCarrier = lazy(
  () => import("./components/logistics/EditFreightCarrier"),
);
const BOMFilesDetailsView = lazy(
  () => import("./components/costing/BOMFilesDetailsView"),
);
const MissingItemCostListView = lazy(
  () => import("./components/costing/MissingItemCostListView"),
);

export const adminRoutes: RouteObject[] = [
  {
    element: <RequireAuth />,
    errorElement: <ErrorPage />,
    children: [
      {
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
            path: "/projects/:projectId",
            element: <ProjectDetailsView />,
          },
          {
            path: "/projects/:projectId/view-bom",
            element: <BOMView />,
          },
          {
            path: "/projects/:projectId/generate-shipper-order",
            element: <GenerateShipperOrder />,
          },
          {
            path: "/projects/:projectId/view-drawings",
            element: <ProjectDrawingsView />,
          },
          {
            path: "/projects/:projectId/material-delivery",
            element: <MaterialDeliveryView />,
          },
          {
            path: "/projects/:projectId/material-delivery/edit",
            element: <EditDeliveryView />,
          },
          {
            path: "/projects/:projectId/shipper-files",
            element: <ShipperFilesView />,
          },
          {
            path: "/projects/:projectId/shipper-files/:requestId",
            element: <ShipperFileDetailsView />,
          },
          {
            path: "/projects/:projectId/shipper-files/:requestId/order-verification",
            element: <OrderVerificationView />,
          },
          {
            path: "/projects/:projectId/material-request",
            element: <MaterialRequestView />,
          },
          {
            path: "/load_planning/list",
            element: <LoadPlanningList />,
          },
          {
            path: "/load_planning/packing-list",
            element: <PackingListView />,
          },
          {
            path: "/load_planning/packing-list/:projectId",
            element: <ProjectPackingList />,
          },
          {
            path: "/load_planning/details/:id",
            element: <LoadPlanDetailsView />,
          },
          {
            path: "/load_planning/packing-list/details/:id",
            element: <PackingListDetailsView />,
          },
          {
            path: "/load_planning/qr-labels",
            element: <QRLabelsView />,
          },
          {
            path: "/load_planning/qr-labels/:projectId",
            element: <ProjectQRLabels />,
          },
          {
            path: "/load_planning/qr-labels/packing-list/:packingListId",
            element: <PackingListQRLabels />,
          },
          {
            path: "/delivery/freight-loads",
            element: <FreightLoadsView />,
          },
          {
            path: "/delivery/awarded-loads",
            element: <AwardedLoadsView />,
          },
          {
            path: "/delivery/freight-request/:projectId",
            element: <FreightRequestDetailsView />,
          },
          {
            path: "/delivery/freight-load/:id",
            element: <FreightLoadDetailsView />,
          },
          {
            path: "/delivery/delivery-details/:id",
            element: <DeliveryDetailsView />,
          },
          {
            path: "/delivery/all-deliveries",
            element: <AllDeliveriesView />,
          },
          {
            path: "/delivery/calendar",
            element: <DeliveryCalendarView />,
          },
          {
            path: "/delivery/notifications",
            element: <DeliveryNotificationsView />,
          },
          {
            path: "/costing",
            element: <CostingView />,
          },
          {
            path: "/costing/bom-details/:id",
            element: <BOMFilesDetailsView />,
          },
          {
            path: "/costing/bom-details/:id/missing-items",
            element: <MissingItemCostListView />,
          },
          {
            path: "/logistics/shippers",
            element: <LogisticsView />,
          },
          {
            path: "/logistics/shippers/add",
            element: <AddNewShipper />,
          },
          {
            path: "/logistics/vendor/:id",
            element: <VendorDetailsView />,
          },
          {
            path: "/logistics/vendor/:id/edit",
            element: <EditShipper />,
          },
          {
            path: "/logistics/freight-carriers",
            element: <FreightCarriersView />,
          },
          {
            path: "/logistics/freight-carriers/add",
            element: <AddNewFreightCourier />,
          },
          {
            path: "/logistics/carrier/:id",
            element: <CarrierDetailsView />,
          },
          {
            path: "/logistics/carrier/:id/edit",
            element: <EditFreightCarrier />,
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
            path: "/load_planning/:requestId/order-verification",
            element: <OrderVerificationView />,
          },
          {
            path: "/load_planning/:requestId/comparison-result",
            element: <ComparisonResultView />,
          },
          {
            path: "/projects/:projectId/start-load-planning",
            element: <StartLoadPlanningView />,
          },
          {
            path: "/load_planning/:projectId",
            element: <ProjectLoadPlanningView />,
            children: [
              {
                path: "list",
                element: <ProjectLoadPlansList />,
              },
              {
                path: "shipper-upload",
                element: <ShipperUploadView />,
              },
              {
                path: "item-analysis",
                element: <ItemAnalysisView />,
              },
              {
                path: "bundle-planner",
                element: <BundlePlannerView />,
              },
              {
                path: "bundle-planner/:bundleId",
                element: <EditBundleView />,
              },
              {
                path: "truck-optimizer",
                element: <TruckOptimizerView />,
              },
              {
                path: "packing-list",
                element: <PackingListViewPage />,
              },
              {
                path: "qr-label",
                element: <QRLabelView />,
              },
              {
                path: "load-plan-review",
                element: <LoadPlanReviewView />,
              },
              {
                path: "freight-selection",
                element: <FreightSelectionView />,
              },
            ],
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
    ],
  },
  {
    element: <RedirectIfAuthenticated />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
    ],
  },
  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <NotFound /> },
];

export const routes: RouteObject[] = [...adminRoutes];
