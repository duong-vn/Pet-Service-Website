"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarContextProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    if (isOpen) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
    setIsOpen(!isOpen);
  };
  const close = () => {
    document.body.style.overflow = ""; // mở lại cuộn
    setIsOpen(false);
  };
  const open = () => {
    document.body.style.overflow = "hidden"; // khóa cuộn
    setIsOpen(true);
  };

  const value: SidebarContextType = {
    isOpen,
    toggle,
    open,
    close,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("Please use under an provider");
  }
  return context;
};
