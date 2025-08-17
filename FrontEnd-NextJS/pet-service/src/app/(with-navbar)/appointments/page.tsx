"use client";
import { motion } from "framer-motion";

export default function ServicesUI() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // trạng thái ban đầu
      animate={{ opacity: 1, y: 0 }} // trạng thái khi xuất hiện
      exit={{ opacity: 0, y: -50 }} // trạng thái khi biến mất
      transition={{ duration: 0.5 }} // thời gian & easing
      className="p-4 bg-blue-500 text-white rounded"
    >
      Hello Framer Motion!
    </motion.div>
  );
}
