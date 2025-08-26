"use client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useSession } from "@/hooks/session-hooks";
import { IService } from "@/types/back-end";
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

interface IFo {
  petWeight: number;
  phone: string;
}

export default function Appointments({ service }: { service: string | null }) {
  const { modal, open, close, isOpen } = useModal();
  const phone = useAppSelector((s) => s.auth.user?.phone);
  const [value, setValue] = useSession<IFo>("services-appointments", {
    petWeight: 0,
    phone: phone ?? "",
  });

  const [loading, setLoading] = useState(service ? false : true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedRangeDate, setSelectedRangeDate] = useState<
    DateRange | undefined
  >();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const toLocalDateString = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
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

  // Slot theo ngày (chỉ gọi khi KHÔNG day-mode & đã chọn ngày)
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
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-light dark:bg-primary-dark rounded-3xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Đặt Lịch Dịch Vụ
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              open({ type: "confirm-modal" });
            }}
            className="space-y-6"
          >
            {/* Service Info */}
            <div className="bg-blue-50 flex justify-between items-center p-4 rounded-3xl">
              <div>
                <h2 className="text-lg text-blue-800 mb-2">
                  Thông Tin Dịch Vụ:
                </h2>
                <p className="text-blue-700">{data?.name ?? "-"}</p>
              </div>
              <Link
                href="/services"
                className="py-2 px-3 border-transparent border-2 text-black bg-primary-light/30 dark:bg-primary-dark/30 hover:border-primary-light rounded-3xl dark:hover:border-primary-dark hover:scale-105 transition-transform"
              >
                Chọn dịch vụ
              </Link>
            </div>

            {/* Date Picker */}
            <div className="flex justify-center flex-col md:flex-row items-center gap-3">
              <div
                className={[
                  "dark:bg-secondary-dark bg-secondary-light rounded-3xl p-3",
                  service ? " block" : "hidden",
                ].join(" ")}
              >
                {isDayMode ? (
                  <DayPicker
                    mode="range"
                    disabled={matcher || loading}
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
                    disabled={matcher || loading}
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

              <div className="text-xs mt-1">
                Chọn ngày từ hôm nay đến {maxDateStr}
                {isDayMode && (
                  <div className="opacity-45">(Ấn 2 lần để reset)</div>
                )}
                <div className="text-xl">
                  Giá:{" "}
                  {typeof briefPrice === "string"
                    ? briefPrice
                    : briefPrice.toLocaleString("vi-VN")}
                </div>
                {data && (
                  <div className="mt-1 text-sm">
                    Thời lượng:{" "}
                    {isDayMode ? `${datePicked} ngày` : `${data.duration} phút`}
                  </div>
                )}
              </div>
            </div>

            {/* Pet info under DayPicker (only when data available) */}
            {data?.pet && (
              <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                *Pet: {data.pet}
              </div>
            )}

            {/* Time Picker */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-2">
                {isDayMode ? (
                  <p>*Giờ đón thú cưng</p>
                ) : (
                  <p className="opacity-50">*Giờ bắt đầu dịch vụ</p>
                )}
                Chọn Giờ *
              </label>

              {!isDayMode && isDayLoading ? (
                <select
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Loading...</option>
                </select>
              ) : (
                <select
                  id="time"
                  disabled={loading || !service}
                  required
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-3xl border border-black/10 dark:border-white/20 bg-white dark:bg-black/50 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-light/60 dark:focus:ring-primary-light/40"
                >
                  <option value="">Chọn giờ</option>
                  {(isDayMode ? timeSlots : daySlots ?? []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Pet Weight */}
            <div>
              <label
                htmlFor="petWeight"
                className="block text-sm font-medium mb-2"
              >
                Cân Nặng Thú Cưng (kg) *
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
                className="w-full px-4 py-3 rounded-3xl border border-black/10 dark:border-white/20 bg-white dark:bg-black/50 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-light/60 dark:focus:ring-primary-light/40"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Số Điện Thoại *
              </label>
              <input
                type="tel"
                id="phone"
                disabled={loading}
                required
                value={value.phone}
                onChange={(e) => setValue({ ...value, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 rounded-3xl border border-black/10 dark:border-white/20  dark:bg-black/50 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-light/60 dark:focus:ring-primary-light/40"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Ghi Chú
              </label>
              <textarea
                id="notes"
                rows={3}
                disabled={loading}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú nếu cần"
                className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-secondary-light/80 hover:bg-secondary-light dark:bg-neutral-dark/80 dark:hover:bg-neutral-dark text-white py-3 px-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin m-auto rounded-full" />
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
                className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Tóm Tắt Đặt Lịch
                </h3>
                <div className="space-y-1 text-green-700">
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
