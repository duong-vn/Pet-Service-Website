"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AppointmentDonePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-8 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Đặt lịch thành công!
        </h1>
        <p className="text-black/80 dark:text-white/80">
          Chúng tôi đã gửi email xác nhận đến bạn. Nhân viên sẽ liên hệ trong
          vòng 1 tiếng để xác nhận lịch hẹn.
        </p>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Nếu có thay đổi về thời gian, dịch vụ hoặc ghi chú, hãy thông báo trực
          tiếp với nhân viên khi họ liên hệ.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl px-5 py-3 bg-primary-dark text-white hover:bg-secondary-dark transition"
          >
            Về trang chủ
          </Link>
          <Link
            href="/services"
            className="rounded-xl px-5 py-3 border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 "
          >
            Xem thêm dịch vụ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
