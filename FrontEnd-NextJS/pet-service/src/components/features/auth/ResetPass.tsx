"use client";
import { resetPassword } from "@/apiServices/auth/services";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ResetPass({ token }: { token: string }) {
  const [touched, setTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const cferr = password !== confirmPassword && touched;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (cferr) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    const success = await resetPassword(token, password);
    if (success) {
      router.replace("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-primary-light/10 to-background-light dark:from-primary-dark/30 dark:to-background-dark">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary-dark dark:text-primary-light">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">
            Tạo mật khẩu mới an toàn và dễ nhớ hơn.
          </p>
        </div>

        <div className="mb-4 text-left">
          <label className="block mb-2 text-sm font-medium text-secondary-dark dark:text-primary-light">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            placeholder="Nhập mật khẩu (≥ 6 ký tự)"
            className={[
              "w-full rounded-xl px-4 py-3 text-base",
              "bg-white dark:bg-transparent",
              "border border-black/10 dark:border-white/30",
              "placeholder:text-black/50 dark:placeholder:text-white/50",
              "focus:outline-none focus:ring-2 focus:ring-primary-light/60 dark:focus:ring-primary-light/50",
            ].join(" ")}
          />
        </div>

        <div className="text-left">
          <label className="block mb-2 text-sm font-medium text-secondary-dark dark:text-primary-light">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
            placeholder="Nhập lại mật khẩu"
            onBlur={() => setTouched(true)}
            className={[
              "w-full rounded-xl px-4 py-3 text-base",
              "bg-white dark:bg-transparent",
              "border border-black/10 dark:border-white/30",
              "placeholder:text-black/50 dark:placeholder:text-white/50",
              "focus:outline-none focus:ring-2 focus:ring-primary-light/60 dark:focus:ring-primary-light/50",
            ].join(" ")}
          />
        </div>

        {cferr && (
          <p className="mt-2 text-sm text-error">
            Mật khẩu xác nhận không khớp với mật khẩu mới
          </p>
        )}

        <button
          type="submit"
          className={[
            "w-full mt-5 rounded-xl px-4 py-3 text-base font-semibold",
            "bg-primary-dark text-white hover:bg-secondary-dark",
            "transition-colors",
          ].join(" ")}
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
}
