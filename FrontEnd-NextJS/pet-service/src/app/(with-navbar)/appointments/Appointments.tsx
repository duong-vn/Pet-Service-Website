"use client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useSession } from "@/hooks/session-hooks";
import { IService, PetType } from "@/types/back-end";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Matcher, DayPicker, DateRange } from "react-day-picker";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { handleError, sendNotifyEmail } from "@/apiServices/services";
import { getPrice } from "@/apiServices/services/services";
import { postAppointments } from "@/apiServices/appointments/services";
import { useModal } from "@/hooks/modal-hooks";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Phone,
  Weight,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface IFo {
  petWeight: number;
  phone: string;
}
export const toLocalDateString = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function Appointments({ service }: { service: string | null }) {
  const { modal, open, close, isOpen } = useModal();
  const phone = useAppSelector((s) => s.auth.user?.phone);
  const [value, setValue] = useSession<IFo>("services-appointments", {
    petWeight: 0,
    phone: phone ?? "",
  });
  const router = useRouter();

  const [loading, setLoading] = useState(service ? false : true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedRangeDate, setSelectedRangeDate] = useState<
    DateRange | undefined
  >();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const toMinutes = (hhmm: string) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    return hh * 60 + mm;
  };
  const minutesToTimeString = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  const {
    data,
    isLoading: isLoadingService,
    isError,
    error,
  } = useQuery({
    queryKey: ["services/:id", service],
    enabled: !!service,
    queryFn: async (): Promise<IService> => {
      const res = await api.get(`/api/services/${service}`);
      return res.data.data;
    },
  });

  const isDayMode = !!(data && data.duration >= 1440);

  const dateStr = selectedDate ? toLocalDateString(selectedDate) : "";

  const { data: daySlots, isLoading: isDayLoading } = useQuery({
    enabled: !isDayMode && !!selectedDate,
    queryKey: ["day-slots", service, selectedDate],
    queryFn: async () => {
      const resData = (
        await api.post("/api/appointments/day-slots", {
          date: dateStr,
          serviceId: service,
        })
      ).data;
      return resData.data.slots as string[];
    },
  });

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }, []);
  const maxDateStr = maxDate.toLocaleDateString();

  const matcher: Matcher[] = [{ before: new Date() }, { after: maxDate }];

  const datePicked = useMemo(() => {
    if (!isDayMode) return 1;
    const from = selectedRangeDate?.from;
    const to = selectedRangeDate?.to;
    if (!from || !to) return 0;
    return differenceInDays(to, from) + 1;
  }, [isDayMode, selectedRangeDate]);

  const briefPrice = useMemo(() => {
    if (!data?.rules?.length) return 0;
    const w = value.petWeight ?? 0;
    if (w >= 100) return "liên hệ";
    const rule = data.rules.find((r) => w >= r.minWeight && w < r.maxWeight);
    const base = rule?.price ?? 0;
    if (typeof base === "string") return base;
    return isDayMode ? base * (datePicked || 0) : base;
  }, [data, value.petWeight, isDayMode, datePicked]);

  const handleSubmit = async () => {
    setLoading(true);
    if (!!!service) {
      toast.error(
        "Có lỗi xảy ra hoặc bạn chưa chọn dịch vụ, vui lòng thử lại sau ít phút"
      );
      return;
    }
    const res = await getPrice(service!, value.petWeight);
    let isEqual = false;
    if (res) {
      if (typeof res === "string") {
        if (res === briefPrice) isEqual = true;
      } else
        isEqual = isDayMode
          ? datePicked * res === briefPrice
          : res === briefPrice;
    }
    if (!isEqual) {
      toast.error("Không trùng giá ở backend và frontendfrontend");

      setLoading(false);
      return;
    }

    const date = isDayMode
      ? toLocalDateString(selectedRangeDate?.from!)
      : selectedDate
      ? toLocalDateString(selectedDate)
      : undefined;
    const duration = isDayMode ? 1440 * datePicked : data?.duration;
    const endTime = isDayMode
      ? minutesToTimeString(toMinutes(selectedTime) + 30)
      : minutesToTimeString(toMinutes(selectedTime) + data?.duration!);
    const payload = {
      service,
      petWeight: value.petWeight,
      phone: value.phone,
      date,
      duration,
      startTime: selectedTime,
      endTime,
      price: briefPrice,
      note: notes,
    };

    const _id = await postAppointments(payload);
    if (_id) {
      toast.success("Đặt lịch thành công");
      const mail = await sendNotifyEmail(_id);
      if (!mail) {
        toast.error("Lỗi không gửi mail được");
        setLoading(false);
      }
      router.replace("/appointments/done");
    }
    toast.error("Đang có lỗi hiện chưa tạo được");
    setLoading(false);
  };

  // Thông báo khi dịch vụ không có bảng giá (chỉ sau khi đã có dữ liệu)
  useEffect(() => {
    if (
      service &&
      !isLoadingService &&
      data &&
      Array.isArray(data.rules) &&
      data.rules.length === 0
    ) {
      toast.error("Chưa có giá cho dịch vụ này");
    }
  }, [service, isLoadingService, data?.rules?.length]);
  if (isError) {
    handleError(error);
    return null;
  }
  if (isLoadingService) {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <LoadingScreen />;
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 dark:bg-gradient-to-t dark:from-primary-dark  dark:to-background-dark  bg-gradient-to-r from-primary-light to-white/30">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-dark to-primary-dark rounded-full mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent mb-2">
              Đặt Lịch Dịch Vụ
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Chọn dịch vụ và thời gian phù hợp cho thú cưng của bạn
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              open({ type: "confirm-modal" });
            }}
            className="space-y-6"
          >
            {/* Service Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border  flex justify-between items-center p-6 rounded-2xl">
              <div>
                <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Thông Tin Dịch Vụ:
                </h2>
                <p className="text-blue-700 dark:text-blue-300 text-lg font-medium">
                  {data?.name ?? "-"}
                </p>
              </div>
              <Link
                href="/services"
                className="flex items-center gap-2 py-3 px-4 text-black hover:bg-secondary-light bg-background-light dark:bg-primary-dark dark:hover:bg-secondary-dark   dark:text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Chọn dịch vụ
              </Link>
            </div>

            {/* Date Picker */}
            <div className="flex justify-center flex-col lg:flex-row items-start gap-8">
              <div
                className={[
                  "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-lg",
                  service ? " block" : "block",
                ].join(" ")}
              >
                {isDayMode ? (
                  <DayPicker
                    mode="range"
                    disabled={matcher}
                    selected={selectedRangeDate}
                    onSelect={setSelectedRangeDate}
                    footer={
                      selectedRangeDate?.from && selectedRangeDate?.to
                        ? `Bạn đã chọn ${selectedRangeDate.from.toLocaleDateString()} đến ${selectedRangeDate.to.toLocaleDateString()}.`
                        : "Hãy chọn khoảng thời gian."
                    }
                  />
                ) : (
                  <DayPicker
                    mode="single"
                    disabled={matcher}
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    footer={
                      selectedDate
                        ? `Bạn đã chọn ${selectedDate.toLocaleDateString()}.`
                        : "Hãy chọn 1 ngày."
                    }
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20   rounded-3xl p-4">
                  <h3 className="font-semibold   mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Thông tin đặt lịch
                  </h3>
                  <p className="text-sm  mb-3">
                    Chọn ngày từ hôm nay đến {maxDateStr}
                  </p>
                  {isDayMode && (
                    <div className="text-xs   px-2 py-1 rounded-full">
                      (Ấn 2 lần để reset)
                    </div>
                  )}
                </div>

                <div className="   bg-purple-900/20  rounded-3xl p-4">
                  <h3 className="font-semibold  mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Chi tiết dịch vụ
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="">Giá:</span>
                      <span className="font-bold text-lg ">
                        {typeof briefPrice === "string"
                          ? briefPrice
                          : briefPrice.toLocaleString("vi-VN") + "đ"}
                      </span>
                    </div>
                    {data && (
                      <div className="flex items-center justify-between">
                        <span className="">Thời lượng:</span>
                        <span className="font-medium ">
                          {isDayMode
                            ? `${datePicked} ngày`
                            : `${data.duration} phút`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {data?.pet && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20  rounded-3xl p-4">
                    <h3 className="font-semibold  mb-2 flex items-center gap-2">
                      <Weight className="w-4 h-4" />
                      Thông tin thú cưng
                    </h3>
                    <p>
                      Thú cưng: {data.pet === PetType.CAT && "Mèo"}
                      {data.pet === PetType.DOG && "Chó"}
                      {data.pet === PetType.OTHER && "Khác"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Time Picker */}
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-lg">
              <label
                htmlFor="time"
                className="block text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  {isDayMode ? (
                    <span>*Giờ đón thú cưng</span>
                  ) : (
                    <span>*Giờ bắt đầu dịch vụ</span>
                  )}
                </div>
                Chọn Giờ *
              </label>

              {!isDayMode && isDayLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-neutral-dark border-t-primary-dark rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">
                    Đang tải khung giờ...
                  </span>
                </div>
              ) : (
                <select
                  id="time"
                  disabled={loading || !service}
                  required
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                >
                  {!isDayMode && selectedDate && daySlots?.length === 0 ? (
                    <option value="">Hết chỗ</option>
                  ) : (
                    <option value="">Chọn giờ </option>
                  )}
                  {(isDayMode ? timeSlots : daySlots ?? []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Pet Weight */}
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-lg">
              <label
                htmlFor="petWeight"
                className="block text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Weight className="w-5 h-5 text-green-500" />
                  Cân Nặng Thú Cưng (kg) *
                </div>
              </label>
              <input
                type="number"
                id="petWeight"
                disabled={loading}
                required
                min={0}
                step={0.5}
                max={99}
                value={value.petWeight || ""}
                onChange={(e) =>
                  setValue({
                    ...value,
                    petWeight: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Nhập cân nặng thú cưng"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
              />
            </div>

            {/* Phone */}
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-lg">
              <label
                htmlFor="phone"
                className="block text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-purple-500" />
                  Số Điện Thoại *
                </div>
              </label>
              <input
                type="tel"
                id="phone"
                disabled={loading}
                required
                value={value.phone}
                onChange={(e) => setValue({ ...value, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
              />
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-lg">
              <label
                htmlFor="notes"
                className="block text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Ghi Chú
                </div>
              </label>
              <textarea
                id="notes"
                rows={3}
                disabled={loading}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú nếu cần"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-lg"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-b from-primary-light to-primary-dark dark:from-secondary-light dark:to-secondary-dark text-white py-4 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <span>Xác Nhận Đặt Lịch</span>
              )}
            </button>
          </form>

          {selectedTime &&
            (selectedDate ||
              (selectedRangeDate?.from && selectedRangeDate?.to)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/30 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Tóm Tắt Đặt Lịch
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700 dark:text-green-300">
                  <p>
                    <span className="font-medium">Dịch vụ:</span> {data?.name}
                  </p>
                  <p>
                    <span className="font-medium">Pet:</span> {data?.pet ?? "-"}
                  </p>
                  <p>
                    <span className="font-medium">Ngày:</span>{" "}
                    {isDayMode
                      ? `${selectedRangeDate?.from?.toLocaleDateString()} đến ${selectedRangeDate?.to?.toLocaleDateString()}`
                      : selectedDate?.toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Giờ:</span> {selectedTime}
                  </p>
                  <p>
                    <span className="font-medium">Cân nặng thú cưng:</span>{" "}
                    {value.petWeight} kg
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại:</span>{" "}
                    {value.phone}
                  </p>
                  {notes && (
                    <p>
                      <span className="font-medium">Ghi chú:</span> {notes}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
        </motion.div>
        {isOpen("confirm-modal") && (
          <ConfirmModal
            onConfirm={handleSubmit}
            onClose={close}
            smallInfo={
              "Kiểm tra thông tin" +
              "\nSdt: " +
              value.phone +
              " Thú cưng:" +
              data?.pet
            }
          />
        )}
      </div>
    </div>
  );
}
