"use client";
import { handleError } from "@/apiServices/services";
import axios from "axios";
import { captureRejectionSymbol } from "events";
import { useRouter } from "next/navigation";
import { FormEvent, FormEventHandler, useState } from "react";
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
    } catch (error: any) {
      handleError(error);
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center text-white items-center flex-col text-center h-screen dark:text-primary-light ">
      <div className="border p-8 rounded-lg bg-primary-dark">
        <h1 className="text-3xl mb-3">Hãy nhập email:</h1>
        <form className="text-white" onSubmit={handleSendEmail}>
          <input
            type="email"
            required
            value={email}
            className="w-full p-3 rounded-lg bg-transparent border border-primary-light dark:border-white/40 focus:outline-none"
            placeholder="Nhập email của bạn"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={[
              "w-full p-3 mt-4 text-lg",
              "rounded-lg border border-primary-light dark:border-white/70",
              "bg-primary-light hover:bg-accent-dark",
              "transition-all duration-100",
            ].join(" ")}
          >
            {!loading ? (
              "Gửi mã xác thực"
            ) : (
              <div className="rounded-full w-4 h-4 m-auto border border-t-transparent border-black  animate-spin">
                {" "}
              </div>
            )}
          </button>
        </form>
        <div
          className={[
            "w-[400] p-5 mt-4 text-2xl",
            " dark:hover:bg-accent-dark border border-black dark:border-white/70 rounded-xl",
            " hover:bg-primary-light cursor-pointer",
            "transition-all duration-100",
          ].join(" ")}
          onClick={() => router.replace("/")}
        >
          Quay về trang chủ
        </div>
      </div>
    </div>
  );
}
