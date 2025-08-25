"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Bath, 
  Scissors, 
  Star, 
  Sparkles, 
  Clock, 
  Dog, 
  Cat, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Weight,
  Calendar,
  User
} from "lucide-react";
import Image from "next/image";

import { useAppSelector } from "@/hooks/redux-hooks";
import { can } from "@/lib/authSlice";
import { PERMISSIONS } from "@/types/permissions";
import { IService, PetType, ServiceType, Variant } from "@/types/back-end";
import { useModal } from "@/hooks/modal-hooks";
import ServiceModal from "../ServiceModal";
import DeleteModal from "@/components/ui/DeleteModal";
import Portal from "@/components/layout/Portal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { handleError } from "@/apiServices/services";
import { api } from "@/utils/axiosInstance";
import { deletePriceRules, deleteServices,  patchPriceRules, postPriceRules } from "@/apiServices/services/services";
import InfoComp from "./InfoComp";
import Link from "next/link";
import ModalPriceRule, { PriceRule } from "./PriceRuleModal";
import PriceRuleModal from "./PriceRuleModal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ServiceDetailClientProps {
  serviceData: IService & { rules: any[] };
}

export default function ServiceDetailClient({ serviceData }: ServiceDetailClientProps) {
  const router = useRouter();
  const { modal, open, close, isOpen } = useModal();
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const qc = useQueryClient()
  
  const [isLoading, setIsLoading] = useState(false);

  const iconOf = (t: ServiceType) => {
    switch (t) {
      case ServiceType.BATH:
        return <Bath className="size-6" />;
      case ServiceType.GROOMING:
        return <Scissors className="size-6" />;
      case ServiceType.HOTEL:
        return <Star className="size-6" />;
      default:
        return <Sparkles className="size-6" />;
    }
  };



  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return price.toLocaleString("vi-VN") + "đ";
  };
  const onCreatePriceRule = async (data:PriceRule) =>{

    const {name,minWeight,maxWeight,isActive,price} = data
      const payload = {
        _id:data._id,
        name,
        minWeight,
        maxWeight,
        isActive,
        price,
        service:serviceData._id
      }
      const res = await postPriceRules(payload)
      if(res) toast.success('Làm giá thành công!')
        qc.invalidateQueries({queryKey:['services/:id',serviceData._id]})
return
     
  }
  const onUpdatePriceRule = async (data:PriceRule) =>{

    const {name,minWeight,maxWeight,isActive,price,_id} = data
      const payload = {
        _id,
        name,
        minWeight,
        maxWeight,
        isActive,
        price,
        service:serviceData._id
      }
      const res = await patchPriceRules(_id!,payload)
      if(res) toast.success('Sửa giá thành công!')
        qc.invalidateQueries({queryKey:['services/:id',serviceData._id]})
return
     
  }

  const handleDelete = async (_id:string)=>{
    const res = await deletePriceRules(_id)
    if(res ){
      toast.success('Xóa thành công')
      qc.invalidateQueries({queryKey:['services/:id',serviceData._id]})
      close()
    }


  }

 

 
  
  useEffect(() => {
    if (modal.type) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [modal.type]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen ">
     
      <div className=" border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="size-5" />
              Quay lại
            </button>
            
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left col */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
            
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={serviceData.picture}
                  alt={serviceData.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-black/90 backdrop-blur rounded-full text-sm font-medium">
                    {iconOf(serviceData.type)}
                    <span>
                      {serviceData.type === ServiceType.BATH && "Tắm"}
                      {serviceData.type === ServiceType.GROOMING && "Tỉa lông"}
                      {serviceData.type === ServiceType.HOTEL && "Khách sạn"}
                      {serviceData.type === ServiceType.OTHER && "Khác"}
                    </span>
                  </div>
                </div>
              </div>

              {/* info */}
             <InfoComp serviceData={serviceData}/>
            </motion.div>
          </div>

          {/* Right Column - Service Details & Pricing */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Service Header */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-gray-200 dark:border-neutral-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl  text-gray-900 dark:text-white mb-2">
                      {serviceData.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="size-4" />
                        ID: {serviceData._id.slice(-8)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-secondary-dark dark:text-primary-light">
                      {formatPrice(serviceData.priceStart)} - {formatPrice(serviceData.priceEnd)}
                    </div>
                    <div className="text-sm text-gray-500">Giá từ - đến</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Mô tả dịch vụ</h3>
                  <ul className="space-y-2">
                    {serviceData.description.map((item, index) => (
                      <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-secondary-dark dark:bg-primary-light rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href={`/appointments?service=${serviceData._id}`} className=" block text-center w-full bg-gradient-to-r from-primary-light/80 to-primary-dark/80 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-light hover:to-primary-dark ">
               
                  Đặt lịch ngay
                 
                </Link>
              </div>

              {/* Pricing Rules */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center"><div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Weight className="size-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bảng giá theo cân nặng</h2></div>
                  
                  { can(permissions,PERMISSIONS.PRICE_RULES_POST)&&
                  <button 
                  onClick={()=>{
                    
                    open({type:'create-modal'})}}
                  className="border text-end rounded-3xl hover:border-secondary-light  dark:hover:border-accent-dark hover:bg-primary-light/30 dark:hover:bg-secondary-dark/70 px-5 py-2 hover:scale-105 transition-transform duration-150  ">Tạo thêm</button>
}
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700">
                  <table className="w-full">
                    <thead className="bg-secondary-light dark:bg-primary-dark ">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Cân nặng
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Tên gói
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                          Giá
                        </th>
                     { can(permissions,PERMISSIONS.PERMISSIONS_DELETE )
                      && can(permissions,PERMISSIONS.PRICE_RULES_DELETE)
                       &&   
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                          hành động
                       </th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {serviceData.rules.map((rule : PriceRule, index) => (
                        <tr key={rule._id} className="hover:bg-background-light/70 bg-background-light dark:bg-background-dark dark:hover:bg-background-dark/50 ">
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {Number(rule.minWeight) === 0 ? (
                              <span>Dưới {rule.maxWeight}kg</span>
                            ) : Number(rule.maxWeight) === 100 ? (
                              <span>Trên {rule.minWeight}kg</span>
                            ) : (
                              <span>{rule.minWeight} - {rule.maxWeight}kg</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                            {rule.name}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {typeof rule.price === 'number' ? formatPrice(rule.price) : rule.price}
                          </td>
                          { can(permissions,PERMISSIONS.PERMISSIONS_DELETE )
                      && can(permissions,PERMISSIONS.PRICE_RULES_DELETE)
                       &&  <td className="text-center space-x-6">
                        <button
                        onClick={()=>open({type:'update-modal',payload:rule})}
                         className="border rounded-3xl border-secondary-light dark:border-accent-dark hover:bg-primary-light/30 dark:hover:bg-secondary-dark/70 px-5 py-1  ">  sửa</button>
                        <button
                        onClick={()=>open({type:'delete-modal',_id:rule._id!})}
                        className="border rounded-3xl border-secondary-light dark:border-accent-dark bg-primary-light/80 hover:bg-primary-light px-5 py-1 dark:bg-primary-dark/80 dark:hover:bg-primary-dark ">  xóa</button>
                          </td>
                          
                          }
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Sparkles className="size-4" />
                    <span className="text-sm font-medium">
                      💡 Mẹo: Chọn gói phù hợp với cân nặng thú cưng để có giá tốt nhất!
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal.type==='create-modal' && (
          <Portal>
            <PriceRuleModal 
              onClose={close} 
              onSubmit={onCreatePriceRule}
            />
          </Portal>
        )}
        {modal.type==='update-modal' && (
          <Portal>
            <PriceRuleModal 
              onClose={close} 
              onSubmit={onUpdatePriceRule}
              initialData={modal.payload}
            />
          </Portal>
        )}
        
        {modal.type === 'delete-modal' && (
          <Portal>
            <DeleteModal
              _id={modal._id}
              
              onClose={close}
              onConfirm={handleDelete}
              title="Xóa dịch vụ"
              message="Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể hoàn tác."
              itemName={'Luật giá'}
              
            />
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}
