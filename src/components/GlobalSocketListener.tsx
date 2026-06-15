import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";
import { createAdminSocket } from "@/lib/socket";
import ProjectAssignedDialog from "@/components/ProjectAssignedDialog";

export default function GlobalSocketListener() {
  const navigate = useNavigate();
  const accessToken = useAppSelector((state: RootState) => state.auth.accessToken);
  const [assignedProject, setAssignedProject] = useState<{ leadId: string; poOrderId: string; projectName: string } | null>(null);
  const [isAssignedDialogOpen, setIsAssignedDialogOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const socket = createAdminSocket(accessToken);
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Global Socket.io listener connected to /admin namespace");
    });

    socket.on("project_assigned", (data: { leadId: string; poOrderId: string; projectName: string }) => {
      console.log(data)
      setAssignedProject(data);
      setIsAssignedDialogOpen(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  const handleViewProjectDetails = () => {
    if (assignedProject) {
      navigate(`/projects/${assignedProject.leadId}`);
      setIsAssignedDialogOpen(false);
    }
  };

  return (
    <ProjectAssignedDialog
      open={isAssignedDialogOpen}
      onClose={() => setIsAssignedDialogOpen(false)}
      payload={assignedProject}
      onViewDetails={handleViewProjectDetails}
    />
  );
}
