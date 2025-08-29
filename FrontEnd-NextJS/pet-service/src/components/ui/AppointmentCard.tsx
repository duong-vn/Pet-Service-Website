import { IAppointments } from "@/hooks/apppointments-hooks";
import { IStatus } from "@/types/back-end";
import { formatDate, formatDuration } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
  Weight,
} from "lucide-react";
import { JSX } from "react";

export default function AppointmentCard({
  appointment,
  index,
  status,
}: {
  appointment: IAppointments;
  index: number;
  status: {
    label: string;
    color: string;
    icon: JSX.Element;
    borderColor: string;
  };
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days} ngày`;
    }
    return `${minutes} phút`;
  };

  const formatPrice = (price: number | string) => {
    return typeof appointment.price === "string"
      ? appointment.price
      : new Intl.NumberFormat("vi-VN").format(price as number) + "đ";
  };
  return (
    <motion.div
      key={appointment._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.01 }}
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-2 ${status.borderColor} overflow-hidden hover:shadow-xl transition-transform duration-300`}
    >
      {/* Status Header */}
      <div
        className={`px-6 py-4 ${status.color} border-b ${status.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status.icon}
            <span className="font-semibold">{status.label}</span>
          </div>
          {formatDate(appointment.date)}
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
            <div className="grid grid-cols-2 gap-y-4 ">
              <div className="flex items-center col-span-2 gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {formatTime(appointment.startTime)} - {appointment.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {formatDuration(appointment.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {formatPrice(appointment.price)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Weight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {appointment.petWeight} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
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
                  <span className="group-hover:hidden">Xem chú thích</span>
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

        {/* Created Date */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs ">
            Đặt lúc: {new Date(appointment.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
