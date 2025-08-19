import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroCard() {
  return (
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
  );
}
