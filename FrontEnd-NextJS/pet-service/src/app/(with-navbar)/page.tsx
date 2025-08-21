"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Scissors,
  Bath,
  Timer,
  Sparkles,
  Shield,
  Phone,
  Calendar,
  Star,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

import BenefitCard from "@/components/ui/BenefitCard";
import ServiceCard from "@/components/ui/ServiceCard";
import HeroCard from "@/components/layout/HeroCard";
import IntroCard from "@/components/layout/IntroCard";
import StepsAppointment from "@/components/layout/StepsAppointment";
import Link from "next/link";
import CTA from "@/components/ui/CTA";
import { useServices } from "@/hooks/services-hook";
import { api } from "@/utils/axiosInstance";
import { handleError } from "@/apiServices/services";
import { IService, ServiceType } from "@/types/back-end";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  const { data: listServices, isLoading, isError, error } = useServices(1, 20);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  console.log("listServices", listServices);

  if (isError) {
    handleError(error);
  }
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

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      {/* HERO */}

      <HeroCard />

      {/* INTRO CARD */}
      <IntroCard />
      <h2 className="mx-auto mt-10 max-w-6xl text-3xl xl:text-5xl px-4 py-10 ">
        Các dịch vụ trong hệ thống:
      </h2>
      {/* benefit */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <BenefitCard
            icon={<Shield className="size-6" />}
            title="An toàn & vệ sinh"
            desc="Dụng cụ khử trùng, quy trình chuẩn – đảm bảo boss luôn sạch sẽ và khỏe mạnh."
          />
          <BenefitCard
            icon={<Timer className="size-6" />}
            title="Nhanh chóng"
            desc="Chọn dịch vụ, đặt lịch trong 30 giây – nhận xác nhận ngay lập tức."
          />
          <BenefitCard
            icon={<Sparkles className="size-6" />}
            title="Chất lượng cao"
            desc="Sản phẩm tắm & ủ dưỡng chọn lọc, phù hợp nhiều loại lông/da."
          />
        </div>
      </section>

      {/* FEATURED SERVICES GRID */}
      <section className="max-w-6xl mx-auto px-4 ">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">Dịch vụ nổi bật</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listServices &&
            listServices.result &&
            (
              [
                ServiceType.BATH,
                ServiceType.GROOMING,
                ServiceType.HOTEL,
                ServiceType.OTHER,
              ] as const
            ).map((type: ServiceType) => {
              const services = listServices.result;
              const service = services.find(
                (item: IService) => item.type == type
              );
              if (!service) return null;
              return (
                <ServiceCard
                  img={service.picture}
                  title={service.name}
                  priceStart={service.priceStart.toLocaleString("vi-VN") + "đ"}
                  priceEnd={service.priceEnd.toLocaleString() + "đ"}
                  items={service.description}
                  icon={iconOf(service.type)}
                />
              );
            })}
        </div>
      </section>

      {/* BOOKING STEPS */}
      <StepsAppointment />

      {/* PRICING STRIP */}
      <section className="bg-gradient-to-r from-primary-light/20 via-transparent to-primary-dark/20 dark:from-primary-dark/30 dark:via-black dark:to-primary-light/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Bảng giá nhanh
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <PriceRow
              name="Tắm siêu tốc (30')"
              priceStart="90.000đ"
              priceEnd="90.000đ"
            />
            <PriceRow
              name="Tắm cơ bản (45')"
              priceStart="120.000đ"
              priceEnd="90.000đ"
            />
            <PriceRow
              name="Tỉa lông cơ bản (60')"
              priceStart="200.000đ"
              priceEnd="90.000đ"
            />
            <PriceRow
              name="Tỉa lông tạo kiểu (75')"
              priceStart="250.000đ"
              priceEnd="90.000đ"
            />
            <PriceRow
              name="Spa thư giãn (90')"
              priceStart="320.000đ"
              priceEnd="90.000đ"
            />
            <PriceRow
              name="Combo Tắm + Tỉa (120')"
              priceStart="360.000đ"
              priceEnd="90.000đ"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-8">
          Khách hàng nói gì?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Testi
            name="Ngọc Anh"
            text="Dịch vụ nhanh, staff thân thiện. Boss mình sạch thơm cả tuần!"
          />
          <Testi
            name="Trung Kiên"
            text="Tỉa lông poodle rất đẹp, tạo kiểu đúng ý. Sẽ quay lại."
          />
          <Testi
            name="Quỳnh Nhi"
            text="Spa thư giãn xịn, bé đỡ stress, lông mượt lên rõ."
          />
        </div>
      </section> */}

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Câu hỏi thường gặp
        </h3>
        <div className="divide-y divide-black/10 dark:divide-white/10 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
          {FAQS.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpenFaq((o) => (o === i ? null : i))}
              className="w-full text-left px-4 py-4 bg-background-light/40 dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/5  flex items-center justify-between"
              aria-expanded={openFaq === i}
            >
              <span className="font-medium">{f.q}</span>
              <ChevronDown
                className={`size-5 transition-transform ${
                  openFaq === i ? "rotate-180" : ""
                }`}
              />
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="basis-full col-span-2 w-full"
                  >
                    <p className="px-1 pt-3 pb-2 text-sm text-black/70 dark:text-white/70">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </>
  );
}

function PriceRow({
  name,
  priceStart,
  priceEnd,
}: {
  name: string;
  priceStart: string;
  priceEnd: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3">
      <div className="flex items-center gap-2">
        <Calendar className="size-4 opacity-70" />
        <span>{name}</span>
      </div>
      <div className="font-semibold">
        {priceStart} - {priceEnd}
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: "Đặt lịch xong có thể đổi giờ không?",
    a: "Có. Bạn có thể đổi giờ trước 2 giờ so với lịch đã đặt, tùy mức độ bận rộn của cửa hàng trong ngày.",
  },
  {
    q: "Có nhận các bé lần đầu đi spa không?",
    a: "Hoàn toàn có. Nhân viên sẽ quan sát phản ứng của bé, làm quen nhẹ nhàng và dùng sản phẩm dịu nhẹ.",
  },
  {
    q: "Có hỗ trợ đón – trả thú cưng không?",
    a: "Một số khu vực nội thành có hỗ trợ với phụ phí nhỏ. Liên hệ hotline để biết chi tiết.",
  },
  {
    q: "Thanh toán như thế nào?",
    a: "Bạn có thể thanh toán tại quầy (tiền mặt/QR) hoặc thanh toán online sau khi đặt lịch.",
  },
];
