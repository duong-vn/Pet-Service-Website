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
import { deleteServices } from "@/apiServices/services/services";
import { useQueryClient } from "@tanstack/react-query";

const src2 = "/images/ui/bang_gia_tam.jpg";
const src1 = "/images/ui/bang_gia_khach_san.jpg";

export default function ServicesUI() {
  const { modal, open, close, isOpen } = useModal();
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const [params, setParams] = useState<ServiceParams>({current:1,pageSize:6})
  
  const { data: listServices, isLoading, isError, error } = useServices(params);
  const qc = useQueryClient()
  const [petFilter, setPetFilter] = useState<{ [k in PetType]?: boolean }>({});
  const [typeFilter, setTypeFilter] = useState<{
    [k in ServiceType]?: boolean;
  }>({});

  const deleteService  = async (id: string) => {
    try {
      const service = listServices.result.find((s:IService)=>s._id==id)
      
         await deleteServices(id,service.public_id)        
         qc.invalidateQueries({queryKey:['services',params]})
    } catch (error) {
      handleError(error);
    } finally {
      close()
    }
  };
  useEffect(() => {
    if (isError) handleError(error);
  }, [isError, error]);


  useEffect(() => {
    const selectedPets = (Object.keys(petFilter) as PetType[]).filter(k => !!petFilter[k]) ;
    const selectedTypes = (Object.keys(typeFilter) as ServiceType[]).filter(k => !!typeFilter[k]);
  
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

  if(isLoading) return (
    <LoadingScreen />
  ) 
  return (
    <div className="pb-16">
      {/* Hero đầu */}
      <section className="mx-auto mt-6 w-[92%] max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* Header chính - Tiêu đề + Nút tạo dịch vụ */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex  flex-col justify-center items-center  rounded-3xl bg-gradient-to-br from-secondary-light to-primary-light p-8 text-secondary-dark shadow-lg dark:from-primary-dark dark:to-secondary-dark dark:text-primary-light"
          >
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Dịch vụ</h1>
              <p className="text-lg md:text-xl opacity-80 mb-6">
                Chăm sóc thú cưng chuyên nghiệp
              </p>
            </div>

            {can(permissions, PERMISSIONS.SERVICES_POST) && (
              <button
                onClick={() => open({ type: "create-modal" })}
                className="group relative px-4 py-4 bg-white/90 dark:bg-black/90 backdrop-blur rounded-2xl border-2 border-transparent hover:border-secondary-dark dark:hover:border-primary-light transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="text-base font-semibold text-secondary-dark dark:text-primary-light group-hover:text-secondary-dark dark:group-hover:text-primary-light transition-colors">
                  + Tạo dịch vụ mới
                </span>
              </button>
            )}
          </motion.div>

          {/* Ảnh lớn bên phải - Khách sạn */}
          <div
            className="relative overflow-hidden rounded-3xl md:h-64 xl:h-72 cursor-pointer group"
            onClick={() => open({ type: "image", src: src1 })}
          >
            <Image
              src={src1}
              alt="Dịch vụ chăm sóc thú cưng"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold mb-1">
                Khách sạn thú cưng
              </h2>
              <p className="text-sm opacity-90">Theo dõi 24/7, chăm sóc tận tâm</p>
            </div>
          </div>

          {/* Ảnh nhỏ bên phải - Tắm gội */}
          <div
            className="relative h-56 overflow-hidden rounded-3xl md:h-64 xl:h-72 cursor-pointer group"
            onClick={() => open({ type: "image", src: src2 })}
          >
            <Image
              src={src2}
              alt="Dịch vụ tắm gội"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
              <h3 className="text-lg font-bold text-white md:text-xl mb-1">
                Tắm & Tỉa lông
              </h3>
              <p className="text-sm opacity-90">Sạch thơm, khô ráo, đẹp lông</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Thanh tiêu đề + nút tạo dịch vụ */}

      {/* Bộ lọc + danh sách dịch vụ */}
      <section className="mx-auto mt-8 w-[92%] max-w-6xl">
      <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
         
         className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-4">
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
        </motion.div>

        <div className="mt-6">
           
            <>        
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listServices.result.map((service: IService) => (
              <motion.article
              whileHover={{ scale: 1.02 }}
              key={service._id}
            >
              <div 
               className="relative">              
              <ServiceCard
                img={service.picture}
                title={service.name}
                priceStart={service.priceStart.toLocaleString("vi-VN") + "đ"}
                priceEnd={service.priceEnd.toLocaleString("vi-VN") + "đ"}
                items={service.description}
                icon={iconOf(service.type)}
                _id={service._id}
              />             
              {can(permissions,PERMISSIONS.SERVICES_DELETE) &&<FaTrashCan  className="absolute top-5 right-5 text-error cursor-pointer" onClick={()=>open({type:'delete-modal',_id:service._id, public_id:service.public_id})}/>
              }
             {can(permissions,PERMISSIONS.SERVICES_PATCH) && <FaPencilAlt className="absolute bottom-16 right-5  cursor-pointer" onClick={()=>open({type:'update-modal',payload:service})} />
            }</div>
            </motion.article>
            ))}
          </div>
         <Pagination current={listServices.meta.current} setParams={setParams} limit={listServices.meta.limit} totalItems={listServices.meta.totalItems} totalPage={listServices.meta.totalPage}/>
          </>            
          
        </div>
      </section>

      {/* Modal tạo dịch vụ */}
      <AnimatePresence>
        {isOpen("create-modal") && (
          <Portal>
            <ServiceModal close={close} />
          </Portal>
        )}
        {modal.type === 'delete-modal' && (
            <Portal>
              <DeleteModal _id= {modal._id} onConfirm = {deleteService}  onClose={close}/>
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
