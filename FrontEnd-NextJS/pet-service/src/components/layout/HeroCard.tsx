import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroCard() {
  return (
    <div className="transition-color duration-700 xl:p-6 w-screen bg-gradient-to-b from-primary-light  to-background-light dark:from-primary-dark  dark:to-background-dark dark:bg-primary-dark flex justify-between items-center rounded-3xl overflow-hidden">
      <motion.article
        initial={{ x: -100, opacity: 0 }}
        animate={{
          filter: "none",
          x: 0,
          opacity: 1,
          transition: { duration: 0.8 },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.8 }}
      >
        <Image
          src="https://res.cloudinary.com/dmgtkwdee/image/upload/v1756456993/cool_dog_dnaa9w.webp"
          alt="cool dog"
          width={300}
          height={300}
          className="hidden xl:flex object-cover rounded-3xl "
        />
      </motion.article>

      <motion.article
        initial={{ filter: "blur(20px)" }}
        animate={{ filter: "none" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.8 }}
        className="z-20"
      >
        <Image
          src="/images/icons/ZOZO-cat.png"
          alt="zozo cat"
          width={900}
          height={900}
          className="mx-auto z-20 hover:scale-105 transition-transform "
        />
      </motion.article>
      <motion.article
        initial={{ x: 100, opacity: 0 }}
        animate={{
          filter: "none",
          x: 0,
          opacity: 1,
          transition: { duration: 0.8 },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.8 }}
      >
        {" "}
        <Image
          src="https://res.cloudinary.com/dmgtkwdee/image/upload/v1756456993/other_v2chiu.webp"
          alt="other"
          width={300}
          height={300}
          className="object-cover hidden xl:flex rounded-3xl "
        />
      </motion.article>
    </div>
  );
}
