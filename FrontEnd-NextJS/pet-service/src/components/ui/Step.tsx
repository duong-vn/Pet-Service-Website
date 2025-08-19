export default function Step({
  n,
  title,
  desc,
}: {
  n: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/70 dark:bg-white/5 backdrop-blur">
      <div className="size-8 rounded-full bg-primary-dark dark:bg-primary-light text-white dark:text-black flex items-center justify-center font-semibold mb-3">
        {n}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm opacity-80">{desc}</div>
    </div>
  );
}
