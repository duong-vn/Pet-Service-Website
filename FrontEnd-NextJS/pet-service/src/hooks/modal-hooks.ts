import { useCallback, useState } from "react";

type Modal =
  | { type: null }
  | { type: "image"; src: string }
  | { type: "create-modal" }
  | { type: "update-modal"; id: string };

export function useModal() {
  const [modal, setModal] = useState<Modal>({ type: null });

  const close = useCallback(() => {
    setModal({ type: null });
  }, []);
  const open = useCallback((m: Exclude<Modal, { type: null }>) => {
    setModal(m);
  }, []);
  const isOpen = (type: Modal["type"]) => modal.type === type;

  return { modal, open, close, isOpen };
}
