"use client";

import { FormEvent, useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleGoogleLogin } from "@/apiServices/services"; // bạn đã có
import { setAT } from "@/lib/authToken";
import Login from "@/components/features/auth/login";
import { motion } from "framer-motion";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { localLogin } from "@/apiServices/auth/services";
import { toast } from "sonner";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { SlActionRedo } from "react-icons/sl";
import { FaArrowRight } from "react-icons/fa";

import Link from "next/link";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setErr(null);
      setLoading(true);

      const credential = credentialResponse?.credential;
      if (!credential) throw new Error("Không nhận được credential từ Google.");
      const { access_token } = (await handleGoogleLogin(credential)).data;
      setAT(access_token);
      // Ví dụ: lưu accessToken vào memory/axios header; refreshToken nên để httpOnly cookie tại backend
      // Nếu backend đã set cookie httpOnly rồi thì không cần làm gì thêm ở FE.
      // Có thể lưu accessToken tạm vào memory hoặc cookie non-httponly (tuỳ chiến lược của bạn).
      // localStorage.setItem("access_token", accessToken);
      toast.success("Đăng nhập thành công!");
      router.push("/appointments");
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Đăng nhập thất bại, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const res = await localLogin(email, password);

    setLoading(false);
    if (res) router.push("/appointments");
  };
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main>
      <div className="min-h-[100dvh] flex items-center flex-col pt-10 px-4  text-secondary-dark dark:text-primary-light">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.88 }}
          className="w-auto h-auto"
        >
          <Image
            src="/images/icons/ZOZO-cat.png"
            alt="ZOZO"
            width={296}
            height={296}
            className="mb-3 animate-pulse"
          />
        </motion.div>

        <div className="w-full max-w-md rounded-3xl ring-2 ring-neutral-dark dark:text-neutral-light bg-secondary-light dark:bg-secondary-dark p-6 shadow-2xl">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <p className="mt-1 text-sm text-muted-foreground text-center ">
              Sử dụng tài khoản Google để tiếp tục.
            </p>
          </div>

          <div className="mt-2 flex justify-center ">
            <Login onSuccess={onSuccess} setErr={setErr} />
          </div>
          <div className="text-center pt-4 ">----------hoặc----------</div>

          <form className="space-y-2" onSubmit={handleSubmit}>
            <label className="flex flex-col ">
              Email:
              <input
                type="email"
                name="email"
                required
                className="rounded-xl mt-1 p-2  dark:text-neutral-light"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              Password:
              <div className="relative  mt-1  ">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  className="rounded-xl w-full p-2 font-sans font-semibold  "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute items-center right-2 top-1/2 -translate-y-1/2 "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye size={20} />
                  ) : (
                    <FaRegEyeSlash size={20} />
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="ring-2 rounded-xl h-10 mt-5 ring-black/40 dark:ring-white/30  bg-secondary-dark text-primary-light hover:bg-primary-dark "
              >
                Đăng nhập
              </button>
            </label>
          </form>
        </div>
        <Link
          href="/auth/register"
          className="flex items-center justify-end text-sm mt-5 hover:underline"
        >
          {" "}
          <FaArrowRight size={20} className="mx-2" />
          Bạn chưa có tài khoản? Đăng kí tại đây
        </Link>
      </div>
    </main>
  );
}
