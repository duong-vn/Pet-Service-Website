import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.3, once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto md:px-4 md:-mt-16 relative z-10"
    >
      <div className="relative overflow-hidden rounded-3xl xl:rounded-[60px] bg-gradient-to-br from-neutral-light via-white to-neutral-light dark:from-secondary-dark dark:via-neutral-900 dark:to-secondary-dark shadow-2xl border border-gray-100/50 dark:border-neutral-700/50">
        <div className="relative p-8 md:p-10 xl:p-16">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-light/8 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary-light/8 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-primary-light/5 to-secondary-light/5 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl  text-center lg:text-left text-primary-dark dark:text-primary-light leading-tight mb-8 lg:mb-12"
            >
              Boss đẹp – Sen vui,{" "}
              <span className="text-secondary-dark dark:text-secondary-light">
                đến ZOZO thôi!
              </span>
            </motion.h1>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Tại{" "}
                  <span className="font-semibold text-primary-dark dark:text-primary-light">
                    ZOZO
                  </span>
                  , chúng tôi cung cấp dịch vụ chăm sóc thú cưng chuyên nghiệp
                  với:
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-secondary-dark to-primary-light dark:from-secondary-light dark:to-primary-light rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong className="text-primary-dark dark:text-primary-light">
                        Tắm rửa & tỉa lông
                      </strong>{" "}
                      - Sạch sẽ, thơm tho, đẹp lông
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-secondary-dark to-primary-light dark:from-secondary-light dark:to-primary-light rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong className="text-primary-dark dark:text-primary-light">
                        Cắt móng & spa
                      </strong>{" "}
                      - Chăm sóc toàn diện cho thú cưng
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-secondary-dark to-primary-light dark:from-secondary-light dark:to-primary-light rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong className="text-primary-dark dark:text-primary-light">
                        Đặt lịch trực tuyến
                      </strong>{" "}
                      - Chỉ vài thao tác, nhận xác nhận ngay
                    </span>
                  </li>
                </ul>

                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed pt-4">
                  Đội ngũ chuyên nghiệp, tận tâm sẽ chăm sóc thú cưng của bạn
                  như chính con cái trong nhà.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.1)]">
                  <Image
                    src="/images/ui/dog_showering.webp"
                    alt="Chó đang được tắm rửa tại ZOZO"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>
                </div>

                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-primary-light/20 to-secondary-light/20 rounded-full blur-sm"></div>
                <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gradient-to-r from-secondary-light/30 to-primary-light/30 rounded-full blur-sm"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
