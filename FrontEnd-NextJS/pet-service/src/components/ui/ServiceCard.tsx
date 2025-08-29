import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function ServiceCard({
  img,
  title,
  priceStart,
  priceEnd,
  items,
  icon,
  _id,
}: {
  img: string;
  title: string;
  priceStart: string;
  priceEnd: string;
  items: string[];
  icon: React.ReactNode;
  _id: string;
}) {
  return (
    <div className="rounded-3xl overflow-hidden min-h-[360] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur shadow-sm">
      <div className="relative h-44 w-full">
        <Image src={img} alt={title} fill className="object-cover" />
        <span className="absolute text-black bg-white rounded-ss-3xl px-2 pt-1 dark:text-white  dark:bg-background-dark bottom-0 right-0 ">
          {priceStart} - {priceEnd}
        </span>
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 text-white text-xs">
          {icon} <span>Nổi bật</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h5 className="font-semibold truncate hover:overflow-visible ">
            {title}
          </h5>
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
          <Link
            href={`/services/${_id}`}
            className="text-primary-dark dark:text-primary-light text-sm underline-offset-4 hover:underline"
            prefetch
          >
            Xem chi tiết
          </Link>
          <Link
            href={`/appointments?service=${_id}`}
            className="rounded-xl bg-primary-dark dark:bg-primary-light text-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            prefetch
          >
            Đặt lịch
          </Link>
        </div>
      </div>
    </div>
  );
}
