"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { X } from "lucide-react";
import Link from "next/link";
import Portal from "@/components/layout/Portal";
import PreviewImage from "@/components/layout/PreviewImage";
import { useModal } from "@/hooks/modal-hooks";

const src2 = "/images/ui/bang_gia_tam.jpg";
const src1 = "/images/ui/bang_gia_khach_san.jpg";
type PriceItem = {
  name: string;
  desc: string;
  price: string;
  duration: string;
};

const PRICE_LIST: PriceItem[] = [
  {
    name: "Tắm cơ bản",
    desc: "Vệ sinh, sấy khô",
    price: "150.000đ",
    duration: "30–45’",
  },
  {
    name: "Cắt tỉa lông",
    desc: "Styling theo giống",
    price: "250.000đ",
    duration: "60–90’",
  },
  {
    name: "Spa dưỡng lông",
    desc: "Ủ dưỡng, chải mượt",
    price: "300.000đ",
    duration: "60’",
  },
  {
    name: "Khám nhanh",
    desc: "Kiểm tra tổng quát",
    price: "200.000đ",
    duration: "20–30’",
  },
];

export default function ServicesUI() {
  const { modal, open, close, isOpen } = useModal();
  const permissions = useAppSelector((s) => s.auth.user?.permissions);

  // lock scroll khi mở modal

  useEffect(() => {
    if (modal.type) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [modal.type]);

  // đóng modal bằng phím ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pb-16">
      {/* HERO: 1-2 ảnh ở đầu */}
      <section className="mx-auto mt-6 w-[92%] max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* Ảnh lớn bên trái */}
          <div
            className="relative col-span-2 h-56 overflow-hidden rounded-3xl md:h-64 xl:h-72"
            onClick={() => open({ type: "image", src: src1 })}
          >
            <Image
              src={src1}
              alt="Dịch vụ chăm sóc thú cưng"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white drop-shadow">
              <h2 className="text-xl font-semibold md:text-2xl">
                Chăm sóc & Spa
              </h2>
              <p className="text-sm opacity-90">Làm đẹp & thư giãn cho boss</p>
            </div>
          </div>

          {/* Ảnh nhỏ bên phải */}
          <div
            className="relative h-56 overflow-hidden rounded-3xl md:h-64 xl:h-72"
            onClick={() => open({ type: "image", src: src2 })}
          >
            <Image
              src={src2}
              alt="Dịch vụ tắm gội"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white drop-shadow">
              <h3 className="text-lg font-semibold md:text-xl">
                Tắm gội cơ bản
              </h3>
              <p className="text-sm opacity-90">Sạch thơm, khô ráo</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Thanh tiêu đề + nút tạo dịch vụ */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-6 flex min-h-24 max-w-6xl items-center justify-between rounded-3xl bg-secondary-light p-4 text-secondary-dark shadow-lg dark:bg-primary-dark dark:text-primary-light"
      >
        <h1 className="text-3xl font-bold md:text-5xl">Dịch vụ</h1>

        {can(permissions, PERMISSIONS.SERVICES_POST) && (
          <button
            onClick={() => open({ type: "create-modal" })}
            className="rounded-2xl border border-black bg-red-400 p-3 text-lg transition hover:scale-105 hover:bg-primary-light dark:bg-secondary-dark dark:hover:bg-accent-dark"
          >
            Tạo dịch vụ
          </button>
        )}
      </motion.div>

      {/* Bảng giá */}
      <section className="mx-auto mt-5 w-[92%] max-w-6xl rounded-3xl border border-background-dark shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-2xl font-semibold">Bảng giá dịch vụ</h2>
          <span className="text-sm opacity-70">Đã bao gồm VAT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-t">
            <thead className="bg-neutral-100 text-left dark:bg-neutral-800">
              <tr className="text-sm">
                <th className="px-6 py-3">Dịch vụ</th>
                <th className="px-6 py-3">Mô tả</th>
                <th className="px-6 py-3">Giá</th>
                <th className="px-6 py-3">Thời lượng</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PRICE_LIST.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">{item.desc}</td>
                  <td className="px-6 py-4">{item.price}</td>
                  <td className="px-6 py-4">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal tạo dịch vụ */}
      <AnimatePresence>
        {isOpen("create-modal") && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            {/* Content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Tạo dịch vụ mới</h3>
                <button
                  aria-label="Đóng"
                  className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form demo — bạn thay bằng form thật */}
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: submit form
                  close();
                }}
              >
                <label className="block">
                  <span className="text-sm">Tên dịch vụ</span>
                  <input
                    className="mt-1 w-full rounded-xl border p-2 dark:bg-neutral-800"
                    placeholder="Ví dụ: Tắm cơ bản"
                  />
                </label>
                <label className="block">
                  <span className="text-sm">Mô tả</span>
                  <textarea
                    className="mt-1 w-full rounded-xl border p-2 dark:bg-neutral-800"
                    rows={3}
                    placeholder="Mô tả ngắn…"
                  />
                </label>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-xl border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 dark:bg-white dark:text-black"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {modal.type == "image" && <PreviewImage src={modal.src} close={close} />}
    </div>
  );
}
