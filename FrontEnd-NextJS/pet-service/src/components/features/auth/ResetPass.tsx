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
    <div className="flex justify-center items-center bg-primary-dark flex-col text-center h-screen text-white dark:text-primary-light ">
      <form
        onSubmit={handleSubmit}
        className="w-full  bg-background-dark max-w-md text-left p-6 rounded-xl border border-black  dark:border-white/20"
      >
        <h2 className="text-2xl mb-4 text-center">Đặt lại mật khẩu</h2>
        <div className="mb-4">
          <label className="block mb-2">Mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            className="w-full p-3 rounded-lg bg-transparent border border-primary-light dark:border-white/40 focus:outline-none"
            placeholder="Nhập mật khẩu (≥ 6 ký tự)"
          />
        </div>
        <div className="">
          <label className="block mb-2">Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
            className="w-full p-3 rounded-lg bg-transparent border border-primary-light dark:border-white/40 focus:outline-none"
            placeholder="Nhập lại mật khẩu"
            onBlur={() => {
              setTouched(true);
            }}
          />
        </div>
        {cferr && (
          <p className="text-error mt-2 ">
            Mật khẩu xác nhận không khớp với mật khẩu mới
          </p>
        )}

        <button
          type="submit"
          className={[
            "w-full p-3 mt-4 text-lg",
            "rounded-lg border border-primary-light dark:border-white/70",
            "bg-primary-light hover:bg-accent-dark",
            "transition-all duration-100",
          ].join(" ")}
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
}
