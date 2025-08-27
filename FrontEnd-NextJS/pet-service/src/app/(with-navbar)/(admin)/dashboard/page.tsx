"use client";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  APParams,
  IAppointments,
  useAppointment,
} from "@/hooks/apppointments-hooks";
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
import { JSX, useEffect, useState } from "react";
import Pagination from "@/components/layout/Pagination";
import AppointmentCard from "@/components/ui/AppointmentCard";
import { handleError } from "@/apiServices/services";
import AppointmentsStats from "./AppointmentsStats";
import { toLocalDateString } from "../../appointments/Appointments";
import { setDate } from "date-fns";

const statusConfig: Record<
  IStatus,
  { label: string; color: string; icon: JSX.Element; borderColor: string }
> = {
  [IStatus.PENDING]: {
    label: "Chờ xác nhận",
    color: "bg-secondary-light dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: <ClockIcon className="w-6 h-6" />,
    borderColor: "border-yellow-200 dark:border-yellow-700/30",
  },
  [IStatus.CONFIRMED]: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: <CheckCircle className="w-6 h-6" />,
    borderColor: "border-blue-200 dark:border-blue-700/30",
  },
  [IStatus.COMPLETED]: {
    label: "Hoàn thành",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    icon: <CheckCircle className="w-6 h-6" />,
    borderColor: "border-green-200 dark:border-green-700/30",
  },
  [IStatus.CANCELED]: {
    label: "Đã hủy",
    color: "bg-error text-black dark:bg-red-900/20 dark:text-red-300",
    icon: <XCircle className="w-6 h-6" />,
    borderColor: "border-red-200 dark:border-red-700/30",
  },
};

export default function AdminDashboardPage() {
  const [params, setParams] = useState<APParams>({
    current: 1,
    pageSize: 8,
    filter: {
      status: [IStatus.PENDING],
    },
    sort: "-date,startTime",
  });

  const in7day = () => {
    let In7Day = new Date();
    In7Day = new Date(In7Day.setDate(In7Day.getDate() + 7));
    const week = toLocalDateString(In7Day);
    const today = toLocalDateString(new Date());

    return `date>=${today}&date<${week}`;
  };

  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const [filterStatus, setFilterStatus] = useState<{
    [k in IStatus]?: Boolean;
  }>({
    PENDING: true,
  });
  const [filterDate, setFilterDate] = useState<string>("");

  const [sort, setSort] = useState<string>("-date,startTime");
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useAppointment(params);
  const counts: { count: number; status: IStatus }[] = appointments?.counts;
  console.log("filt", filterDate, "par", params.filter?.date);
  useEffect(() => {
    const filteredStatus = (Object.keys(filterStatus) as IStatus[]).filter(
      (s) => filterStatus[s]
    );
    if (filteredStatus.length > 0 || sort.length > 0 || filterDate.length > 0) {
      setParams((prev) => ({
        ...prev,
        current: 1,
        filter: {
          status: filteredStatus.length > 0 ? filteredStatus : [],
          date: filterDate.length > 0 ? filterDate : "",
        },
        sort: sort.length ? sort : "",
      }));
    } else {
      const { filter, sort, ...rest } = params;
      setParams((prev) => ({
        ...rest,
        current: 1,
      }));
    }
  }, [filterStatus, filterDate, sort, setParams]);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadingScreen />
      </div>
    );
  }

  if (isError) {
    handleError(error);
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
          <h1 className="text-3xl md:text-4xl  mb-4  bg-clip-text text-transparent">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Quản lý và theo dõi tất cả lịch hẹn trong hệ thống. Mỗi card hiển
            thị thông tin chi tiết về lịch hẹn với trạng thái được làm nổi bật.
          </p>
        </div>

        {/* Stats Overview */}
        <AppointmentsStats
          total={appointments.meta.total}
          isLoading={isLoading}
          counts={counts}
        />
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Danh sách lịch hẹn gần đây
        </h2>
        {/* filter, sort*/}
        <div className="flex justify-between">
          <form className="space-x-2">
            {(Object.values(IStatus) as IStatus[]).map((t) => (
              <label
                key={t}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!filterStatus[t]}
                  onChange={(e) =>
                    setFilterStatus((f) => ({ ...f, [t]: e.target.checked }))
                  }
                  className="size-4"
                />
                <span>{statusConfig[t].label}</span>
              </label>
            ))}
            {/* <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filterDate[t]}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, [t]: e.target.checked }))
                }
                className="size-4"
              />
              <span>{statusConfig[t].label}</span>
            </label> */}
          </form>
          <form className="space-x-2">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}
            >
              <option value="">Sắp xếp</option>
              <option value="date">Cũ nhất</option>
              <option value="-date,startTime">Mới nhất</option>
            </select>
            <select
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
              }}
            >
              <option value="">Tất cả</option>
              <option value={"date=" + toLocalDateString(new Date())}>
                Hôm nay
              </option>
              <option value={in7day()}>Trong 7 ngày tới</option>
            </select>
          </form>
        </div>
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
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  index={index}
                  status={status}
                />
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
