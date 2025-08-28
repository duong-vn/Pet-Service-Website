import { useCallback, useEffect, useState } from "react";

type Modal =
  | { type: null }
  | { type: "image"; src: string }
  | { type: "create-modal" }
  | { type: "update-modal"; payload: any }
  | { type: "delete-modal"; _id: string; public_id?: string }
  | { type: "confirm-modal"; payload: any };

export function useModal() {
  const [modal, setModal] = useState<Modal>({ type: null });
  useEffect(() => {
    if (modal.type) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [modal.type]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = useCallback(() => {
    setModal({ type: null });
  }, []);
  const open = useCallback((m: Exclude<Modal, { type: null }>) => {
    setModal(m);
  }, []);
  const isOpen = (type: Modal["type"]) => modal.type === type;

  return { modal, open, close, isOpen };
}
