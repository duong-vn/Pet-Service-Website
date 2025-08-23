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

const src2 = "/images/ui/bang_gia_tam.jpg";
const src1 = "/images/ui/bang_gia_khach_san.jpg";

export default function ServicesUI() {
  const { modal, open, close, isOpen } = useModal();
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const [params, setParams] = useState<ServiceParams>({current:1,pageSize:6})
  
  const { data: listServices, isLoading, isError, error } = useServices(params);
  
  const [petFilter, setPetFilter] = useState<{ [k in PetType]?: boolean }>({});
  const [typeFilter, setTypeFilter] = useState<{
    [k in ServiceType]?: boolean;
  }>({});

  const deleteServicece = async (_id:string)=>{

  }

  useEffect(() => {
    if (isError) handleError(error);
  }, [isError, error]);


  useEffect(() => {
    const selectedPets = (Object.keys(petFilter) as PetType[]).filter(k => !!petFilter[k]) ;
    const selectedTypes = (Object.keys(typeFilter) as ServiceType[]).filter(k => !!typeFilter[k]);
  
    setParams((p: ServiceParams) => {
      // Only include filter if both pet and type have selections
      if (selectedPets.length > 0 || selectedTypes.length > 0) {
        return {
          ...p,
          current: 1, // đổi filter thì reset page
          filter: {
            pet: selectedPets.length > 0 ? selectedPets : [], // Provide default if empty
            type: selectedTypes.length > 0 ? selectedTypes : [], // Provide default if empty
          },
        };
      } else {
        // No filters selected, remove filter property entirely
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

  // lock scroll

  useEffect(() => {
    if (modal.type) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [modal.type]);

  // đóng modal bằng  ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pb-16">
      {/* HERO đầu */}
      
      <section className="mx-auto mt-6 w-[92%] max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
         
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" flex min-h-24  max-w-6xl items-center  rounded-3xl bg-secondary-light p-4 text-secondary-dark shadow-lg dark:bg-primary-dark dark:text-primary-light"
          >
            <div className="flex  items-center flex-col gap-4">
              <h1 className="text-3xl font-bold md:text-5xl">Dịch vụ</h1>

              {can(permissions, PERMISSIONS.SERVICES_POST) && (
                <button
                  onClick={() => open({ type: "create-modal" })}
                  className="rounded-2xl border border-black bg-red-400 p-3 text-lg transition hover:scale-105 hover:bg-primary-light dark:bg-secondary-dark dark:hover:bg-accent-dark"
                >
                  Tạo dịch vụ
                </button>
              )}
            </div>
          </motion.div>
          {/* Ảnh lớn bên trái */}
          <div
            className="relative  h-56 overflow-hidden rounded-3xl md:h-64 xl:h-72"
            onClick={() => open({ type: "image", src: src1 })}
          >
            <Image
              src={src1}
              alt="Dịch vụ chăm sóc thú cưng"
              fill
              className="object-contain transition-transform duration-500 hover:scale-105"
              priority
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl   bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white drop-shadow">
              <h2 className="text-xl  md:text-2xl">
                Bảng giá khách sạn
              </h2>
              <p className="text-sm opacity-90">Theo dõi 24/7</p>
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
              className="object-contain transition-transform duration-500 hover:scale-105"
              priority
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl text-white bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-4  drop-shadow text-white">
              <h3 className="text-lg font-semibold text-white md:text-xl">
                Tắm, tỉa lông
              </h3>
              <p className="text-sm opacity-90">Sạch thơm, khô ráo</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Thanh tiêu đề + nút tạo dịch vụ */}

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


            <>
          

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listServices.result.map((service: IService) => (
              <motion.article
              whileHover={{ scale: 1.02 }}
              key={service._id}
            >
              <div 
               className="relative"
              
              >
              
              <ServiceCard
                img={service.picture}
                title={service.name}
                priceStart={service.priceStart.toLocaleString("vi-VN") + "đ"}
                priceEnd={service.priceEnd.toLocaleString("vi-VN") + "đ"}
                items={service.description}
                icon={iconOf(service.type)}
                _id={service._id}
              />
             
              <FaTrashCan  className="absolute top-2 right-4 text-error cursor-pointer" onClick={()=>open({type:'delete-modal',_id:service._id})}/>
              <FaPencilAlt className="absolute bottom-16 right-4  cursor-pointer" onClick={()=>open({type:'update-modal',payload:service})} />
            </div>
            </motion.article>
            ))}

          </div>
         <Pagination current={listServices.meta.current} setParams={setParams} limit={listServices.meta.limit} totalItems={listServices.meta.totalItems} totalPage={listServices.meta.totalPage}/>
          </>
            
          )}
        </div>
      </section>

      {/* Modal tạo dịch vụ */}
      <AnimatePresence>
        {isOpen("create-modal") && (
          <Portal>
            <ServiceModal close={close} />
          </Portal>
        )}
        {
         modal.type === 'delete-modal' && (
            <Portal>
              <DeleteModal _id= {modal._id} onConfirm = {deleteServicece}  onClose={close}
              
              />
            </Portal>
          )
        }
         {modal.type ==='update-modal' && (
         <Portal>
            <ServiceModal close={close}  serviceData={modal.payload}/>
            </Portal>
        )}


      </AnimatePresence>
      {modal.type == "image" && <PreviewImage src={modal.src} close={close} />}
    </div>
  );
}
