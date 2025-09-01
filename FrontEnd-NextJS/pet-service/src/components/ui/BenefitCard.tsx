import { motion } from "framer-motion";
interface IProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function BenefitCard({ icon, title, desc }: IProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/70 dark:bg-white/5 backdrop-blur"
    >
      <div className="inline-flex items-center justify-center size-10 rounded-full bg-primary-dark/10 dark:bg-primary-light/10 text-primary-dark dark:text-primary-light mb-3">
        {icon}
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm opacity-80">{desc}</p>
    </motion.div>
  );
}
