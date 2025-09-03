"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { Bath, Scissors, Sparkles, Star } from "lucide-react";

import PreviewImage from "@/components/layout/PreviewImage";
import { useModal } from "@/hooks/modal-hooks";
import { ServiceParams, useServices } from "@/hooks/services-hook";

import ServiceCard from "@/components/ui/ServiceCard";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { handleError } from "@/apiServices/services";
import { IService, PetType, ServiceType } from "@/types/back-end";
import ServiceModal from "./ServiceModal";
import Portal from "@/components/layout/Portal";
import Pagination from "@/components/layout/Pagination";
import { FaTrashCan } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";

import DeleteModal from "@/components/ui/DeleteModal";
import { deleteServices } from "@/apiServices/services/services";
import { useQueryClient } from "@tanstack/react-query";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const src2 = "/images/ui/bang_gia_tam.jpg";
const src1 = "/images/ui/bang_gia_khach_san.jpg";

export default function ServicesUI() {
  const { modal, open, close, isOpen } = useModal();
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const [params, setParams] = useState<ServiceParams>({
    current: 1,
    pageSize: 6,
  });

  const { data: listServices, isLoading, isError, error } = useServices(params);
  const qc = useQueryClient();
  const [petFilter, setPetFilter] = useState<{ [k in PetType]?: boolean }>({});
  const [typeFilter, setTypeFilter] = useState<{
    [k in ServiceType]?: boolean;
  }>({});

  const deleteService = async (id: string) => {
    try {
      const service = listServices.result.find((s: IService) => s._id == id);

      await deleteServices(id, service.public_id);
      qc.invalidateQueries({ queryKey: ["services", params] });
    } catch (error) {
      handleError(error);
    } finally {
      close();
    }
  };
  useEffect(() => {
    if (isError) handleError(error);
  }, [isError, error]);

  useEffect(() => {
    const selectedPets = (Object.keys(petFilter) as PetType[]).filter(
      (k) => !!petFilter[k]
    );
    const selectedTypes = (Object.keys(typeFilter) as ServiceType[]).filter(
      (k) => !!typeFilter[k]
    );

    setParams((p: ServiceParams) => {
      if (selectedPets.length > 0 || selectedTypes.length > 0) {
        return {
          ...p,
          current: 1,
          filter: {
            pet: selectedPets.length > 0 ? selectedPets : [],
            type: selectedTypes.length > 0 ? selectedTypes : [],
          },
        };
      } else {
        const { filter, ...rest } = p;
        return {
          ...rest,
          current: 1,
        };
      }
    });
  }, [petFilter, typeFilter, setParams]);
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

  return (
    <div className="pb-8">
      <section className="mx-auto mt-4 w-[96%] max-w-7xl">
        {/*tiêu đề */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Dịch vụ</h1>
            <p className="text-base md:text-lg opacity-80">
              Chăm sóc thú cưng chuyên nghiệp
            </p>
          </div>
          {can(permissions, PERMISSIONS.SERVICES_POST) && (
            <button
              onClick={() => open({ type: "create-modal" })}
              className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-xl font-semibold shadow hover:scale-105 transition-all"
            >
              + Tạo dịch vụ mới
            </button>
          )}
          {/* xem bảng giá  */}

          {/* Tạo đvu  */}
        </div>

        {/* Bộ lọc dạng thanh ngang */}
        <div className="w-full  mb-4 ">
          <div className="flex flex-wrap min-h-16 px-3 gap-6 items-center justify-between py-2  bg-white/80 dark:bg-white/10 rounded-xl border border-black/10 dark:border-white/10 shadow">
            {/* Pet filter */}
            <div className="flex gap-4 items-center">
              <span className="font-semibold text-sm">Thú cưng:</span>
              <label className="inline-flex items-center gap-1 cursor-pointer">
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
              <label className="inline-flex items-center gap-1 cursor-pointer">
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
            {/* Service type filter */}
            <div className="flex gap-4 flex-wrap items-center">
              <span className="font-semibold text-sm">Loại dịch vụ:</span>
              {[
                ServiceType.BATH,
                ServiceType.GROOMING,
                ServiceType.HOTEL,
                ServiceType.OTHER,
              ].map((t) => (
                <label
                  key={t}
                  className="inline-flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!typeFilter[t]}
                    onChange={(e) =>
                      setTypeFilter((f) => ({
                        ...f,
                        [t]: e.target.checked,
                      }))
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

        {/* Danh sách dịch vụ luôn hiển thị phía trên */}
        <div className="mb-6">
          {isLoading ? (
            <div className="min-h-[40vh] flex justify-center items-center">
              <LoadingScreen />
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-6">
                {listServices?.result &&
                  listServices.result.map((service: IService) => (
                    <motion.article
                      whileHover={{ scale: 1.02 }}
                      key={service._id}
                      className="max-small:flex max-sm:justify-center"
                    >
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <ServiceCard
                            img={service.picture}
                            title={service.name}
                            priceStart={
                              service.priceStart.toLocaleString("vi-VN") + "đ"
                            }
                            priceEnd={
                              service.priceEnd.toLocaleString("vi-VN") + "đ"
                            }
                            items={service.description}
                            icon={iconOf(service.type)}
                            _id={service._id}
                          />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          {(can(permissions, PERMISSIONS.SERVICES_DELETE) ||
                            can(permissions, PERMISSIONS.SERVICES_PATCH)) && (
                            <>
                              <ContextMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  open({
                                    type: "delete-modal",
                                    _id: service._id,
                                    public_id: service.public_id,
                                  })
                                }
                              >
                                {can(
                                  permissions,
                                  PERMISSIONS.SERVICES_DELETE
                                ) && (
                                  <div className=" flex justify-center space-x-2 items-center">
                                    <FaTrashCan className=" text-error cursor-pointer" />
                                    <span>Xóa</span>
                                  </div>
                                )}
                              </ContextMenuItem>
                              <ContextMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  open({
                                    type: "update-modal",
                                    payload: service,
                                  })
                                }
                              >
                                {can(
                                  permissions,
                                  PERMISSIONS.SERVICES_PATCH
                                ) && (
                                  <div className=" flex justify-center space-x-2 items-center">
                                    <FaPencilAlt />
                                    <span>Sửa</span>
                                  </div>
                                )}
                              </ContextMenuItem>
                            </>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    </motion.article>
                  ))}
              </div>
              <Pagination
                current={listServices.meta.current}
                setParams={setParams}
                totalItems={listServices.meta.totalItems}
                totalPage={listServices.meta.totalPage}
              />
            </>
          )}
        </div>

        <Carousel className="">
          <CarouselContent className="w-60">
            <CarouselItem className="">
              {" "}
              <div
                className="relative overflow-hidden rounded-2xl h-40 cursor-pointer group"
                onClick={() => open({ type: "image", src: src2 })}
              >
                <Image
                  src={src2}
                  alt="Dịch vụ tắm gội"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white drop-shadow-lg">
                  <h3 className="text-base font-bold mb-1">Tắm & Tỉa lông</h3>
                  <p className="text-xs opacity-90">
                    Sạch thơm, khô ráo, đẹp lông
                  </p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              {" "}
              <div
                className="relative overflow-hidden rounded-2xl h-40 cursor-pointer group"
                onClick={() => open({ type: "image", src: src1 })}
              >
                <Image
                  src={src1}
                  alt="Dịch vụ chăm sóc thú cưng"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white drop-shadow-lg">
                  <h2 className="text-lg font-bold mb-1">Khách sạn thú cưng</h2>
                  <p className="text-xs opacity-90">
                    Theo dõi 24/7, chăm sóc tận tâm
                  </p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* Modal tạo dịch vụ */}
        <AnimatePresence>
          {isOpen("create-modal") && (
            <Portal>
              <ServiceModal close={close} />
            </Portal>
          )}
          {modal.type === "delete-modal" && (
            <Portal>
              <DeleteModal
                _id={modal._id}
                onConfirm={deleteService}
                onClose={close}
              />
            </Portal>
          )}
          {modal.type === "update-modal" && (
            <Portal>
              <ServiceModal close={close} serviceData={modal.payload} />
            </Portal>
          )}
        </AnimatePresence>
        {modal.type == "image" && (
          <PreviewImage src={modal.src} close={close} />
        )}
      </section>
    </div>
  );
}
