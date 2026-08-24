import { createContext } from "react";
import type { Socket, SendTeamMessagePayload } from "@/lib/socket";

export interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinChannel: (channelType: "direct" | "group", channelId: string) => void;
  leaveChannel: (channelType: "direct" | "group", channelId: string) => void;
  sendTypingStart: (channelType: "direct" | "group", channelId: string) => void;
  sendTypingStop: (channelType: "direct" | "group", channelId: string) => void;
  sendMessage: (payload: SendTeamMessagePayload) => void;
}

export const SocketContext = createContext<SocketContextValue | null>(null);
