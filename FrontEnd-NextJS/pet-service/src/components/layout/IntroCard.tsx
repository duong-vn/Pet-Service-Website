import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroCard() {
  return (
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

          <div className=" block 2xl:flex xl:mx-10 border-b-2 border-background-light/40 dark:border-white/10">
            <p className="text-xl pb-6 p-3 flex items-center xl:leading-[60px] xl:relative xl:-top-20 ">
              Tại đây, bạn có thể dễ dàng lựa chọn các dịch vụ như tắm rửa, tỉa
              lông, cắt móng hay spa cho thú cưng và đặt lịch trực tiếp ngay
              trên website. Chỉ với vài thao tác đơn giản, thú cưng của bạn sẽ
              được chăm sóc tận tình bởi đội ngũ chuyên nghiệp.
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
  );
}
