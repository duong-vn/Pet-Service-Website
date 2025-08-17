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
import { useState } from "react";

import BenefitCard from "@/components/ui/BenefitCard";
import ServiceCard from "@/components/ui/ServiceCard";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* HERO */}
      <div className="transition-color duration-700 xl:p-6 w-screen bg-gradient-to-b from-primary-light  to-background-light dark:from-primary-dark  dark:to-background-dark dark:bg-primary-dark flex justify-between items-center rounded-3xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.88 }}
          className="w-auto h-auto"
        >
          <Image
            src="/images/icons/cool_dog.webp"
            alt="cool dog"
            width={300}
            height={300}
            className="hidden xl:flex object-cover rounded-3xl transition-all hover:drop-shadow-2xl "
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.8 }}
          className="w-auto h-auto"
        >
          <Image
            src="/images/icons/ZOZO-cat.png"
            alt="zozo cat"
            width={900}
            height={900}
            className="mx-auto transition-all z-50 hover:drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.88 }}
          className="w-auto h-auto"
        >
          <Image
            src="/images/icons/other.webp"
            alt="other"
            width={300}
            height={300}
            className="object-cover hidden xl:flex rounded-3xl transition-all hover:shadow-2xl"
          />
        </motion.div>
      </div>

      {/* INTRO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 400 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2, once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full xl:w-[60%] xl:-mt-24 mx-auto rounded-3xl xl:rounded-[70px] bg-neutral-light dark:bg-secondary-dark shadow-2xl">
          <div>
            <h1 className="text-5xl text-center xl:text-start p-10 xl:text-7xl xl:w-[70%] text-primary-dark dark:text-primary-light">
              Boss đẹp – Sen vui, đến ZOZO thôi!
            </h1>

            <div className="xl:flex xl:mx-10 border-b-2 border-background-light/40 dark:border-white/10">
              <p className="text-xl pb-6 p-3 flex items-center xl:leading-[60px] xl:relative xl:-top-20 ">
                Tại đây, bạn có thể dễ dàng lựa chọn các dịch vụ như tắm rửa,
                tỉa lông, cắt móng hay spa cho thú cưng và đặt lịch trực tiếp
                ngay trên website. Chỉ với vài thao tác đơn giản, thú cưng của
                bạn sẽ được chăm sóc tận tình bởi đội ngũ chuyên nghiệp.
              </p>
              <Image
                src="/images/ui/dog_showering.webp"
                alt="dog showering"
                height={600}
                width={600}
                className="shadow-2xl mx-auto mb-6 rounded-3xl xl:rounded-full xl:relative xl:-top-20"
              />
            </div>
          </div>
        </div>
      </motion.div>
      <h2 className="mx-auto mt-10 max-w-6xl text-3xl xl:text-5xl px-4 py-10 text-primary-dark dark:text-primary-light">
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
          <ServiceCard
            img="/images/placeholders/meo.webp"
            title="Tắm cơ bản"
            price="120.000đ"
            items={["Gội xả sạch", "Sấy khô", "Vệ sinh tai"]}
            icon={<Bath className="size-5" />}
          />
          <ServiceCard
            img="/images/placeholders/meo.webp"
            title="Tỉa lông tạo kiểu"
            price="250.000đ"
            items={["Tư vấn kiểu", "Tỉa mặt", "Gọn gàng theo giống"]}
            icon={<Scissors className="size-5" />}
          />
          <ServiceCard
            img="/images/placeholders/meo.webp"
            title="Spa thư giãn"
            price="320.000đ"
            items={["Massage", "Ủ dưỡng", "Tinh dầu thơm"]}
            icon={<Sparkles className="size-5" />}
          />
        </div>
      </section>

      {/* BOOKING STEPS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-8">
          Quy trình đặt lịch
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <Step n={1} title="Chọn dịch vụ" desc="Tắm, tỉa lông, spa…" />
          <Step n={2} title="Chọn thời gian" desc="Khung giờ trống phù hợp" />
          <Step n={3} title="Nhập thông tin" desc="Tên boss & liên hệ" />
          <Step n={4} title="Xác nhận" desc="Nhận thông báo qua email" />
        </div>
      </section>

      {/* PRICING STRIP */}
      <section className="bg-gradient-to-r from-primary-light/20 via-transparent to-primary-dark/20 dark:from-primary-dark/30 dark:via-black dark:to-primary-light/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Bảng giá nhanh
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <PriceRow name="Tắm siêu tốc (30')" price="90.000đ" />
            <PriceRow name="Tắm cơ bản (45')" price="120.000đ" />
            <PriceRow name="Tỉa lông cơ bản (60')" price="200.000đ" />
            <PriceRow name="Tỉa lông tạo kiểu (75')" price="250.000đ" />
            <PriceRow name="Spa thư giãn (90')" price="320.000đ" />
            <PriceRow name="Combo Tắm + Tỉa (120')" price="360.000đ" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
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
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Câu hỏi thường gặp
        </h3>
        <div className="divide-y divide-black/10 dark:divide-white/10 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
          {FAQS.map((f, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq((o) => (o === i ? null : i))}
              className="w-full text-left px-4 py-4 bg-background-light/40 dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-between"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="rounded-3xl bg-gradient-to-tr from-primary-light to-primary-dark dark:from-primary-dark dark:to-primary-light text-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                Sẵn sàng cho một chiếc boss thơm tho?
              </h3>
              <p className="opacity-90">
                Đặt lịch chỉ trong vài chạm – chọn dịch vụ phù hợp và khung giờ
                bạn muốn.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/services"
                className="rounded-2xl bg-white/90 text-primary-dark px-5 py-3 font-semibold hover:bg-white transition"
              >
                Đặt lịch ngay
              </a>
              <a
                href="tel:+8400000000"
                className="rounded-2xl bg-black/20 text-white px-5 py-3 font-semibold hover:bg-black/30 transition flex items-center gap-2"
              >
                <Phone className="size-4" /> Gọi nhanh
              </a>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/70 dark:bg-white/5 backdrop-blur">
      <div className="size-8 rounded-full bg-primary-dark dark:bg-primary-light text-white dark:text-black flex items-center justify-center font-semibold mb-3">
        {n}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm opacity-80">{desc}</div>
    </div>
  );
}

function PriceRow({ name, price }: { name: string; price: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3">
      <div className="flex items-center gap-2">
        <Calendar className="size-4 opacity-70" />
        <span>{name}</span>
      </div>
      <div className="font-semibold">{price}</div>
    </div>
  );
}

function Testi({ name, text }: { name: string; text: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/70 dark:bg-white/5 backdrop-blur"
    >
      <div className="flex items-center gap-2 mb-2">
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
      </div>
      <p className="text-sm opacity-90">{text}</p>
      <div className="mt-3 text-sm font-medium opacity-80">— {name}</div>
    </motion.div>
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
