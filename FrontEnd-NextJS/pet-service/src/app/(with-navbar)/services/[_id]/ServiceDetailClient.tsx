"use client";

import { useState } from "react";
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
import { deleteServices } from "@/apiServices/services/services";

interface ServiceDetailClientProps {
  serviceData: IService & { rules: any[] };
}

export default function ServiceDetailClient({ serviceData }: ServiceDetailClientProps) {
  const router = useRouter();
  const { modal, open, close, isOpen } = useModal();
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  
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

  const petIcon = (p: PetType) => {
    switch (p) {
      case PetType.DOG:
        return <Dog className="size-5" />;
      case PetType.CAT:
        return <Cat className="size-5" />;
      default:
        return <Sparkles className="size-5" />;
    }
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id: string,public_id:string) => {
    setIsLoading(true);
    try {
         await deleteServices(id,public_id)
   
      router.push('/services');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      close();
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="size-5" />
              Quay lại
            </button>
            
            {can(permissions, PERMISSIONS.SERVICES_PATCH) && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => open({ type:"update-modal",payload:serviceData })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="size-4" />
                  Chỉnh sửa
                </button>
                {can(permissions, PERMISSIONS.SERVICES_DELETE) && (
                  <button
                    onClick={() => open({ type: "delete-modal",_id:serviceData._id,public_id:serviceData.public_id })}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="size-4" />
                    Xóa
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Image & Basic Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Service Image */}
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

              {/* Basic Info Cards */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-gray-200 dark:border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Weight className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Thông tin cơ bản</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Thú cưng:</span>
                      <div className="flex items-center gap-1">
                        {petIcon(serviceData.pet)}
                        <span>
                          {serviceData.pet === PetType.DOG ? "Chó" : 
                           serviceData.pet === PetType.CAT ? "Mèo" : "Khác"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Biến thể:</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-xs">
                        {serviceData.variant}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Thời lượng:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{serviceData.duration} phút</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-gray-200 dark:border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Calendar className="size-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Thông tin tạo</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Tạo lúc:</span>
                      <span>{formatDate(serviceData.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Cập nhật:</span>
                      <span>{formatDate(serviceData.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
                      <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Đặt lịch ngay
                </button>
              </div>

              {/* Pricing Rules */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Weight className="size-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bảng giá theo cân nặng</h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {serviceData.rules.map((rule, index) => (
                        <tr key={rule._id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {rule.minWeight === 0 ? (
                              <span>Dưới {rule.maxWeight}kg</span>
                            ) : rule.maxWeight === 100 ? (
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
        {isOpen("update-modal") && (
          <Portal>
            <ServiceModal 
              close={close} 
              serviceData={serviceData}
            />
          </Portal>
        )}
        
        {isOpen("delete-modal") && (
          <Portal>
            <DeleteModal
              _id={serviceData._id}
              public_id={serviceData.public_id}
              onClose={close}
              onConfirm={handleDelete}
              title="Xóa dịch vụ"
              message="Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể hoàn tác."
              itemName={serviceData.name}
              loading={isLoading}
            />
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}
