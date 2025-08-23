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


  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {

      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggle = () => {
    setIsOpen((v) => !v);
  };
  const close = () => {
    setIsOpen(false);
  };
  const open = () => {
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
