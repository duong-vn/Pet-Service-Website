import { IStatus } from "@/types/back-end";
import { Calendar, CheckCircle, ClockIcon, XCircle } from "lucide-react";

export default function AppointmentsStats({
  isLoading,
  counts,
  total,
}: {
  isLoading: boolean;
  counts: { count: number; status: IStatus }[];
  total: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tổng lịch hẹn
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {total ?? 0}
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
              {(!isLoading &&
                counts &&
                counts.filter((s) => s.status === IStatus.PENDING)[0]?.count) ??
                0}
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
              {(!isLoading &&
                counts &&
                counts.filter((s) => s.status === IStatus.CONFIRMED)[0]
                  ?.count) ??
                0}
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
              {(!isLoading &&
                counts &&
                counts.filter((s) => s.status === IStatus.COMPLETED)[0]
                  ?.count) ??
                0}
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
              {(!isLoading &&
                counts &&
                counts.filter((s) => s.status === IStatus.CANCELED)[0]
                  ?.count) ??
                0}
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
