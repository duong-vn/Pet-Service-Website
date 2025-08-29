import { motion } from "framer-motion";
import { X } from "lucide-react";

import { useState } from "react";
import { LuDog } from "react-icons/lu";

interface IProps {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  smallInfo?: string;
  itemName?: string;
}

export default function ConfirmModal({
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn đặt lịch?",
  smallInfo = "*Sẽ có nhân viên liên hệ để xác nhận",
  itemName,
}: IProps) {
  const [loading, setLoading] = useState(false);

  const doNothing = () => {};
  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={loading ? onClose : doNothing}
      />

      {/* Content */}
      <div className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
              <LuDog className="h-5 w-5 text-green-300 dark:text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            aria-label="Đóng"
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-neutral-800"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
          {itemName && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Item:</span> {itemName}
            </p>
          )}
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            {smallInfo}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-neutral-800"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
            }}
            disabled={loading}
            className="rounded-xl bg-primary-dark px-4 py-2 text-white hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang tạo...
              </div>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
