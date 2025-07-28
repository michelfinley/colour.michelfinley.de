import { createContext } from "react";

export interface NotificationData {
  type: "success" | "error";
  text: string;
}

export const NotificationContext = createContext({});
