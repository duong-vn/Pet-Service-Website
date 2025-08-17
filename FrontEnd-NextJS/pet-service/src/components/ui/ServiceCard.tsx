import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
export default function ServiceCard({
  img,
  title,
  price,
  items,
  icon,
}: {
  img: string;
  title: string;
  price: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur shadow-sm"
    >
      <div className="relative h-44 w-full">
        <Image src={img} alt={title} fill className="object-cover" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 text-white text-xs">
          {icon} <span>Nổi bật</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h5 className="font-semibold">{title}</h5>
          <span className="text-primary-dark dark:text-primary-light font-bold">
            {price}
          </span>
        </div>
        {items.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm opacity-80">
            {items.map((it) => (
              <li key={it} className="flex items-center gap-2">
                <CheckCircle className="size-4 opacity-70" /> {it}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center justify-between">
          <a
            href="/services"
            className="text-primary-dark dark:text-primary-light text-sm underline-offset-4 hover:underline"
          >
            Xem chi tiết
          </a>
          <button className="rounded-xl bg-primary-dark dark:bg-primary-light text-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition">
            Đặt lịch
          </button>
        </div>
      </div>
    </motion.article>
  );
}
