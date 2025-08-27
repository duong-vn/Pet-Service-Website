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
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-2 ${status.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300`}
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
        </div>
      </div>

      {/* Appointment Content */}
      <div className="p-6 space-y-4">
        {/* Service Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ngày: {formatDate(appointment.date)}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {formatTime(appointment.startTime)} - {appointment.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Weight className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {appointment.petWeight} kg
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
        </div>

        {/* User Info */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {appointment.createdBy?.email || "Không có thông tin"}
            </span>
          </div>

          {appointment.note && (
            <div className="flex items-start gap-2 text-sm mt-2">
              <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">
                {appointment.note}
              </span>
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Tạo lúc: {new Date(appointment.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
