export default function LoadingScreen() {
  return (
    <div
      className="flex items-center justify-center flex-col text-center
                 dark:text-primary-light text-secondary-dark"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-12 w-12 rounded-full border-4 border-primary-dark dark:border-primary-light border-t-transparent dark:border-t-transparent animate-spin" />
      <h1 className="mt-4 text-2xl font-semibold">Đang xử lý…</h1>
      <p className="mt-1 text-sm opacity-70">Vui lòng chờ trong giây lát</p>
      <div className="mt-6 h-2 w-56 rounded-full bg-black/10 dark:bg-white/10 ">
        <div className="h-full w-1/3 animate-pulse bg-current/40" />
      </div>
    </div>
  );
}
