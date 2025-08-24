import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-3xl text-black dark:text-white bg-gradient-to-tl  from-primary-light dark to-background-light dark:from-primary-dark dark:to-background-dark  p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1  ">
            <h3 className="text-3xl   md:text-4xl  mb-2 ">
              Sẵn sàng cho một chiếc boss thơm tho?
            </h3>
            <p className="opacity-90  ">
              Đặt lịch chỉ trong vài chạm – chọn dịch vụ phù hợp và khung giờ
              bạn muốn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="rounded-2xl bg-white/90 text-primary-dark px-5 py-3 font-semibold hover:bg-white transition"
            >
              Đặt lịch ngay
            </Link>
            <a
              href="tel:+84886535580"
              className="rounded-2xl bg-black/20 text-white px-5 py-3 font-semibold hover:bg-black/30 transition flex items-center gap-2"
            >
              <Phone className="size-4" /> Gọi nhanh
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
