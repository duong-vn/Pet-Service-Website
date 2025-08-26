"use client";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { useQueries, useQuery } from "@tanstack/react-query";
import { IAppointments, useAppointment } from "@/hooks/apppointments-hooks";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  Calendar,
  Clock,
  User,
  Weight,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { IStatus } from "@/types/back-end";
import { JSX, useState } from "react";
import Pagination from "@/components/layout/Pagination";

// Status configuration with colors and icons (aligned with IStatus)
const statusConfig: Record<
  IStatus,
  { label: string; color: string; icon: JSX.Element; borderColor: string }
> = {
  [IStatus.PENDING]: {
    label: "Chờ xác nhận",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: <ClockIcon className="w-4 h-4" />,
    borderColor: "border-yellow-200 dark:border-yellow-700/30",
  },
  [IStatus.CONFIRMED]: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: <CheckCircle className="w-4 h-4" />,
    borderColor: "border-blue-200 dark:border-blue-700/30",
  },
  [IStatus.COMPLETED]: {
    label: "Hoàn thành",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    icon: <CheckCircle className="w-4 h-4" />,
    borderColor: "border-green-200 dark:border-green-700/30",
  },
  [IStatus.CANCELED]: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    icon: <XCircle className="w-4 h-4" />,
    borderColor: "border-red-200 dark:border-red-700/30",
  },
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to format time
const formatTime = (timeString: string) => {
  return timeString;
};

// Helper function to format duration
const formatDuration = (minutes: number) => {
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    return `${days} ngày`;
  }
  return `${minutes} phút`;
};

// Helper function to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

export default function AdminDashboardPage() {
  const [params, setParams] = useState({ current: 1, pageSize: 8 });
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const [filter, setFilter] = useState<{ [k in IStatus]?: Boolean }>({});

  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useAppointment(params);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadingScreen />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Không thể tải danh sách lịch hẹn
          </p>
        </div>
      </div>
    );
  }

  const list = appointments?.result ?? [];

  return (
    <div className="min-h-[60vh]   px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Quản lý và theo dõi tất cả lịch hẹn trong hệ thống. Mỗi card hiển
            thị thông tin chi tiết về lịch hẹn với trạng thái được làm nổi bật.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tổng lịch hẹn
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {list.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Chờ xác nhận
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    list.filter(
                      (apt: IAppointments) => apt.status === IStatus.PENDING
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đã xác nhận
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    list.filter(
                      (apt: IAppointments) => apt.status === IStatus.CONFIRMED
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Hoàn thành
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    list.filter(
                      (apt: IAppointments) => apt.status === IStatus.COMPLETED
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đã hủy
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    list.filter(
                      (apt: IAppointments) => apt.status === IStatus.CANCELED
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <form>
        {/* {[
          IStatus.CANCELED,
          IStatus.COMPLETED,
          IStatus.CONFIRMED,
          IStatus.PENDING,
        ].map((t) => ( */}
        {(Object.values(IStatus) as IStatus[]).map((t) => (
          <label
            key={t}
            className="inline-flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!!filter[t]}
              onChange={(e) =>
                setFilter((f) => ({ ...f, [t]: e.target.checked }))
              }
              className="size-4"
            />
            <span>
              {t === IStatus.CANCELED && "Đã hủy"}
              {t === IStatus.COMPLETED && "Hoàn thành"}
              {t === IStatus.CONFIRMED && "Xác nhận"}
              {t === IStatus.PENDING && "Đang duyệt"}
            </span>
          </label>
        ))}
      </form>

      {/* Appointments List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Danh sách lịch hẹn gần đây
        </h2>
        {!list.length ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              Chưa có lịch hẹn nào
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Hệ thống sẽ hiển thị lịch hẹn ở đây khi có dữ liệu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {list.map((appointment: IAppointments, index: any) => {
              const status =
                statusConfig[
                  (appointment.status as IStatus) in statusConfig
                    ? (appointment.status as IStatus)
                    : IStatus.PENDING
                ];

              return (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 ${status.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300`}
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
                          Lịch hẹn dịch vụ
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
                          {formatTime(appointment.startTime)} -{" "}
                          {appointment.endTime}
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
                          {typeof appointment.price === "string"
                            ? appointment.price
                            : formatPrice(appointment.price)}
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
                        Tạo lúc:{" "}
                        {new Date(appointment.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        <Pagination
          current={appointments?.meta.current}
          limit={appointments?.meta.limit}
          setParams={setParams}
          totalItems={appointments?.meta.total}
          totalPage={appointments?.meta.pages}
        />
      </div>
    </div>
  );
}
