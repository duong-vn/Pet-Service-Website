"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Weight, DollarSign, Tag, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { handleNumStringForForm } from "../ServiceModal";

export interface PriceRule {
  _id?: string;
  name: string;
  minWeight: string;
  maxWeight: string;
  price: number | string;
  isActive: boolean;
}

interface ModalPriceRuleProps {
  
  onClose: () => void;
  onSubmit: (rule: PriceRule,_id?:string) => Promise<void>;
  initialData?: PriceRule;
}

export default function PriceRuleModal({
  
  onClose,
  onSubmit,
  initialData,
}: ModalPriceRuleProps) {
  const [name, setName] = useState(initialData?.name?? '');
  const isEdit = !!initialData

  const [minWeight, setMinWeight] = useState<string>(initialData?.minWeight?? '0');
  const [maxWeight, setMaxWeight] = useState<string>(initialData?.maxWeight?? '0');
  const [price, setPrice] = useState<number | string>(initialData?.price?? 'liên hệ');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  

  const validateForm = (): boolean => {
    // Validate name
    if (!name.trim()) {
      toast.error("Tên gói không được để trống");
      return false;
    } 

    // Validate minWeight
    if (Number(minWeight) < 0) {
      toast.error("Cân nặng tối thiểu không được âm");
      return false;
    }

    // Validate maxWeight
    if (Number(maxWeight) <= Number(minWeight)) {
      toast.error("Cân nặng tối đa phải lớn hơn tối thiểu");
      return false;
    } else if (Number(maxWeight) > 100) {
      toast.error("Cân nặng tối đa không được vượt quá 100kg");
      return false;
    } 

    // Validate price
    if (typeof price === 'number' && price < 0) {
      toast.error("Giá không được âm");
      return false;
    } else if (typeof price === 'string' && price.trim() === '') {
      toast.error("Giá không được để trống");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!validateForm()) {
     
      return;
    }

    setIsLoading(true);
    try {
      const ruleData = {
        _id:initialData?._id, 
        name: name.trim(),
        minWeight,
        maxWeight,
        price,
        isActive,
      };

      await onSubmit(ruleData);
      
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeightLabel = (min: string, max: string): string => {
    if (Number(min) === 0) return `Dưới ${max}kg`;
    if (Number(max) >= 100) return `Trên ${min}kg`;
    return `${min} - ${max}kg`;
  };

 

  return (
    <
    >
      <div      
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-700"
      >
        <div className=" hidden absolute md:flex top-8 right-20 text-error">
          Cân nặng tôi đa cao nhất là 100
        </div>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl  ">
                {isEdit ? "Chỉnh sửa quy tắc giá" : "Tạo quy tắc giá mới"}
              </h2>
              <p className="text-sm ">
                {isEdit ? "Cập nhật thông tin quy tắc giá" : "Thêm quy tắc giá theo cân nặng"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preview */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
              <Weight className="w-4 h-4" />
              <span className="font-medium">Xem trước:</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>{name || "Tên gói"}</strong> - {getWeightLabel(minWeight, maxWeight)}
            </p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên gói <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              
                   'border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Ví dụ: Tắm thường chó dưới 5kg"
              disabled={isLoading}
            />
           
          </div>

          {/* Weight Range */}
          <div className="grid grid-cols-2 gap-4 text-black dark:text-white">
            <div>
              <label className="block text-sm font-medium  text-gray-700 dark:text-gray-300 mb-2">
                Cân nặng tối thiểu (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                min="0"
                max="99"
                value={minWeight}
                onChange={async (e) => await handleNumStringForForm(e,setMinWeight,setIsLoading) }
                className={`w-full bg-white px-4 py-3 rounded-xl border transition-colors 
                  dark:text-white
                     border-gray-300 dark:border-neutral-600  dark:bg-neutral-800
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="0"
                disabled={isLoading}
              />
            
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cân nặng tối đa (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                min="1"
                max="100"
                value={maxWeight}
                onChange={(e) => setMaxWeight((e.target.value))}
                className={`w-full px-4 py-3 rounded-xl border bg-white
                      dark:text-white dark:bg-neutral-800
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="5"
                disabled={isLoading}
              />
              
            </div >
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giá <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors
                  dark:text-white
                     border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="100000 hoặc 'liên hệ'"
                disabled={isLoading}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Nhập số tiền (VD: 100000) hoặc text (VD: liên hệ)
            </p>
            
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Kích hoạt quy tắc này
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl font-medium transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-secondary-light dark:bg-secondary-dark hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEdit ? "Cập nhật" : "Tạo mới"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
