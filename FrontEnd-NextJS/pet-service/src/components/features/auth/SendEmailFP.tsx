"use client";
import { handleError } from "@/apiServices/services";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function SendEmailFP() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forget-password", { email });
      toast.success(
        "Đã gửi email xác thực, vui lòng kiểm tra hộp thư của bạn."
      );
      router.replace("/auth/verify");
    } catch (error: any) {
      handleError(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br  from-primary-dark/30 to-background-dark">
      <div className="w-full max-w-md rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-secondary-dark dark:text-primary-light">
            Quên mật khẩu
          </h1>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">
            Nhập email để nhận liên kết đặt lại mật khẩu.
          </p>
        </div>

        <form onSubmit={handleSendEmail} className="space-y-4">
          <div className="text-left">
            <label className="block mb-2 text-sm font-medium text-secondary-dark dark:text-primary-light">
              Email
            </label>
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className={[
                "w-full rounded-xl text-black px-4 py-3 text-base",
                "bg-white ",
                "border border-black/10 dark:border-white/30",
                "placeholder:text-black/50 dark:placeholder:text-white/50",
                "focus:outline-none focus:ring-2 focus:ring-primary-light/60 dark:focus:ring-primary-light/50",
              ].join(" ")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={[
              "w-full rounded-xl px-4 py-3 text-base font-semibold",
              "bg-primary-dark text-white hover:bg-secondary-dark",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "transition-colors",
            ].join(" ")}
          >
            {!loading ? (
              "Gửi mã xác thực"
            ) : (
              <div className="w-5 h-5 m-auto rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.replace("/")}
          className={[
            "w-full mt-4 rounded-xl px-4 py-3 text-base",
            "border border-black/10 dark:border-white/20",
            "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10",
            "text-secondary-dark dark:text-primary-light",
            "transition-colors",
          ].join(" ")}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
