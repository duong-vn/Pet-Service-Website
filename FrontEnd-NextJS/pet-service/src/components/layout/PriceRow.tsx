import { Calendar } from "lucide-react";

export default function PriceRow({
  name,
  priceStart,
  priceEnd,
}: {
  name: string;
  priceStart: string;
  priceEnd: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3">
      <Calendar className="size-4 opacity-70" />
      <span className="overflow-hidden ">{name}</span>

      <div className="flex items-center flex-col">
        <div className="font-semibold">{priceStart}</div>
        <div></div>
        <div className="font-semibold">{priceEnd}</div>
      </div>
    </div>
  );
}
