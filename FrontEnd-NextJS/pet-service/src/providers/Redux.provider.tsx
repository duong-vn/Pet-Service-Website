"use client";
import { makeStore } from "@/store/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: ReactNode }) {
  const store = makeStore;
  return <Provider store={store}>{children}</Provider>;
}
