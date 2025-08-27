import { IAppointments } from "@/hooks/apppointments-hooks";
import { IStatus } from "@/types/back-end";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
  Weight,
} from "lucide-react";
import { JSX, useState } from "react";

type Props = {
  close: () => void;
  payload: {
    appointment: IAppointments;
    status: {
      label: string;
      color: string;
      icon: JSX.Element;
      borderColor: string;
    };
  };

  onUpdate: (data: { _id: string; status: IStatus; note: string }) => void;
};

const STATUS_LABELS: Record<IStatus, string> = {
  [IStatus.PENDING]: "Chờ xác nhận",
  [IStatus.CONFIRMED]: "Đã xác nhận",
  [IStatus.COMPLETED]: "Hoàn thành",
  [IStatus.CANCELED]: "Đã hủy",
};

export default function AppointmentModal({ close, payload, onUpdate }: Props) {
  const { appointment, status } = payload;

  // state cho form
  const [note, setNote] = useState<string>(appointment.note ?? "");
  const [curStatus, setCurStatus] = useState<IStatus>(
    (appointment.status as IStatus) ?? IStatus.PENDING
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate({
        _id: appointment._id,
        status: curStatus,
        note,
      });
      close();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-40 " onClick={close} />

      <div className="fixed top-1/2 min-w-[30vw] min-h-[20vw] left-1/2 z-50  -translate-y-1/2 -translate-x-1/2">
        <div
          className={`bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-2 ${status.borderColor} overflow-hidden hover:shadow-xl transition-transform duration-300`}
        >
          {/* Status Header */}
          <div
            className={`px-6 py-4 ${status.color} border-b ${status.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status.icon}
                <span className="font-semibold">
                  {STATUS_LABELS[curStatus]}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Content */}
          <div className="p-6 space-y-4">
            {/* Service Info */}
            <div className="flex items-start gap-4">
              <div className="w-36 h-36 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                {appointment.service?.picture ? (
                  <img
                    src={appointment.service.picture}
                    alt="Service"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                  {appointment?.service?.name ?? "Lịch hẹn dịch vụ"}
                </h3>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {appointment.phone ?? "Không có sđt"} -{" "}
                      {appointment?.createdBy?.name || "không có tên"}
                    </span>
                  </div>

                  <div className="flex items-start w-full gap-2 text-sm mt-2 ">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400 hover:break-all cursor-default ">
                      {appointment.note?.length > 0 ? (
                        <div className="group relative">
                          {" "}
                          <span className="group-hover:hidden">
                            Xem chú thích
                          </span>
                          <span className="group-hover:block hidden">
                            {" "}
                            {appointment.note}
                          </span>
                        </div>
                      ) : (
                        "Không có chú thích"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
            </div>

            {/* Created Date */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs ">
                Đặt lúc:{" "}
                {new Date(appointment.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>

            {/* --- FORM: Note + Status --- */}
            <form
              onSubmit={handleSave}
              className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú…"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trạng thái
                </label>
                <select
                  value={curStatus}
                  onChange={(e) => setCurStatus(e.target.value as IStatus)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(IStatus).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
            {/* --- END FORM --- */}
          </div>
        </div>
      </div>
    </>
  );
}
