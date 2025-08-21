"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { X, Bath, Scissors, Sparkles, Star } from "lucide-react";

import PreviewImage from "@/components/layout/PreviewImage";
import { useModal } from "@/hooks/modal-hooks";
import { useServices } from "@/hooks/services-hook";

import ServiceCard from "@/components/ui/ServiceCard";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { handleError } from "@/apiServices/services";
import { IService, PetType, ServiceType } from "@/types/back-end";

const src2 = "/images/ui/bang_gia_tam.jpg";
const src1 = "/images/ui/bang_gia_khach_san.jpg";

export default function ServicesUI() {
  const { modal, open, close, isOpen } = useModal();
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const { data: listServices, isLoading, isError, error } = useServices(1, 20);

  const [petFilter, setPetFilter] = useState<{ [k in PetType]?: boolean }>({});
  const [typeFilter, setTypeFilter] = useState<{
    [k in ServiceType]?: boolean;
  }>({});

  useEffect(() => {
    if (isError) handleError(error);
  }, [isError, error]);

  const filteredServices = useMemo(() => {
    const data = listServices?.result ?? [];
    const hasPet = Object.values(petFilter).some(Boolean);
    const hasType = Object.values(typeFilter).some(Boolean);
    return data.filter((s: IService) => {
      const okPet = hasPet ? !!petFilter[s.pet] : true;
      const okType = hasType ? !!typeFilter[s.type] : true;
      return okPet && okType;
    });
  }, [listServices, petFilter, typeFilter]);

  const iconOf = (t: ServiceType) => {
    switch (t) {
      case ServiceType.BATH:
        return <Bath className="size-5" />;
      case ServiceType.GROOMING:
        return <Scissors className="size-5" />;
      case ServiceType.HOTEL:
        return <Star className="size-5" />;
      default:
        return <Sparkles className="size-5" />;
    }
  };

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

      {/* Bộ lọc + danh sách dịch vụ */}
      <section className="mx-auto mt-8 w-[92%] max-w-6xl">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-4">
          <h3 className="text-lg font-semibold mb-3">Bộ lọc</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm opacity-80 mb-2">Thú cưng</p>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!petFilter[PetType.DOG]}
                    onChange={(e) =>
                      setPetFilter((f) => ({
                        ...f,
                        [PetType.DOG]: e.target.checked,
                      }))
                    }
                    className="size-4"
                  />
                  <span>Chó</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!petFilter[PetType.CAT]}
                    onChange={(e) =>
                      setPetFilter((f) => ({
                        ...f,
                        [PetType.CAT]: e.target.checked,
                      }))
                    }
                    className="size-4"
                  />
                  <span>Mèo</span>
                </label>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-2">Loại dịch vụ</p>
              <div className="flex flex-wrap gap-4">
                {[
                  ServiceType.BATH,
                  ServiceType.GROOMING,
                  ServiceType.HOTEL,
                  ServiceType.OTHER,
                ].map((t) => (
                  <label
                    key={t}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!typeFilter[t]}
                      onChange={(e) =>
                        setTypeFilter((f) => ({ ...f, [t]: e.target.checked }))
                      }
                      className="size-4"
                    />
                    <span>
                      {t === ServiceType.BATH && "Tắm"}
                      {t === ServiceType.GROOMING && "Tỉa lông"}
                      {t === ServiceType.HOTEL && "Khách sạn"}
                      {t === ServiceType.OTHER && "Khác"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service: IService) => (
                <ServiceCard
                  key={service.id}
                  img={service.picture}
                  title={service.name}
                  priceStart={service.priceStart.toLocaleString("vi-VN") + "đ"}
                  priceEnd={service.priceEnd.toLocaleString("vi-VN") + "đ"}
                  items={service.description}
                  icon={iconOf(service.type)}
                />
              ))}
            </div>
          )}
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
