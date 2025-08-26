import { PetType } from "@/types/back-end";
import { Calendar, Cat, Clock, Dog, Sparkles, Weight } from "lucide-react";

export default function InfoComp({ serviceData }: { serviceData: any }) {
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-gray-200 dark:border-neutral-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Weight className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Thông tin cơ bản
          </h3>
        </div>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="font-medium">Thú cưng:</span>
            <div className="flex items-center gap-1">
              {petIcon(serviceData.pet)}
              <span>
                {serviceData.pet === PetType.DOG
                  ? "Chó"
                  : serviceData.pet === PetType.CAT
                  ? "Mèo"
                  : "Khác"}
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
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Thông tin tạo
          </h3>
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
  );
}
