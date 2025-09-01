import { motion } from "framer-motion";
import Step from "../ui/Step";

export default function StepsAppointment() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h3 className="text-2xl md:text-3xl font-bold mb-8">
        Quy trình đặt lịch
      </h3>
      <div className="grid md:grid-cols-4 gap-6">
        <motion.article
          whileHover={{ scale: 1.05 }}
          initial={{ x: -100 }}
          viewport={{ once: true }}
          whileInView={{ x: 0, transition: { duration: 0.5 } }}
        >
          <Step n={1} title="Chọn dịch vụ" desc="Tắm, tỉa lông, khách sạn..." />
        </motion.article>
        <motion.article
          whileHover={{ scale: 1.05 }}
          initial={{ y: 100 }}
          viewport={{ once: true }}
          whileInView={{ y: 0, transition: { duration: 0.5 } }}
        >
          <Step n={2} title="Chọn thời gian" desc="Khung giờ trống phù hợp" />
        </motion.article>
        <motion.article
          whileHover={{ scale: 1.05 }}
          initial={{ y: 100 }}
          viewport={{ once: true }}
          whileInView={{ y: 0, transition: { duration: 0.5 } }}
        >
          <Step n={3} title="Nhập thông tin" desc="Cân nặng boss & liên hệ" />
        </motion.article>

        <motion.article
          whileHover={{ scale: 1.05 }}
          initial={{ x: 100 }}
          viewport={{ once: true }}
          whileInView={{ x: 0, transition: { duration: 0.5 } }}
        >
          {" "}
          <Step n={4} title="Xác nhận" desc="Thông báo email, số liên hệ" />
        </motion.article>
      </div>
    </section>
  );
}
