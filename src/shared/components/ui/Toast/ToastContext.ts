import { createContext } from "react";
import type { ToastContextType } from "./types";

// Toast Context
export const ToastContext = createContext<ToastContextType | null>(null);
