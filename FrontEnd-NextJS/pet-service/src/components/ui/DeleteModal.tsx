import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { tree } from "next/dist/build/templates/app-page";
import { useState } from "react";

interface IProps {
    _id:string;
    public_id:string
  onClose: () => void;
  onConfirm: (_id:string,public_id:string) => void;
  title?: string;
  message?: string;
  itemName?: string;
  
}

export default function DeleteModal({ 
    _id,
    public_id,
  onClose, 
  onConfirm, 
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa item này không?",
  itemName,
 
}: IProps) {
const qc = useQueryClient()
const [loading,setLoading] = useState(false)

const handleDelete = async ()=>{
  setLoading(true)
  await onConfirm(_id,public_id)
  qc.invalidateQueries({queryKey:['services']})
  setLoading(false)
  close()
}
const doNothing =()=>{

}
  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={loading?onClose:doNothing}
      />

      {/* Content */}
      <motion.div
        className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
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
          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>
          {itemName && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Item:</span> {itemName}
            </p>
          )}
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            ⚠️ Hành động này không thể hoàn tác
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
            onClick={handleDelete
            }
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang xóa...
              </div>
            ) : (
              "Xóa"
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}