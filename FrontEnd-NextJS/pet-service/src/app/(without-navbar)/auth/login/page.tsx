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

      //   router.replace(redirectTo ?? "/"); // điều hướng sau login
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
    console.log(res);
    setLoading(false);
    router.push("/appointments");
  };

  return (
    <main className="min-h-[100dvh] flex items-center flex-col justify-center px-4 text-primary-dark">
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

      <div className="w-full max-w-md rounded-3xl ring-2 ring-neutral-dark bg-secondary-light p-6 shadow-2xl">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="mt-1 text-sm text-muted-foreground text-center text-secondary-dark">
            Sử dụng tài khoản Google để tiếp tục.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Login onSuccess={onSuccess} setErr={setErr} />
        </div>
        <div className="text-center pt-4 text-secondary-dark">
          ----------hoặc----------
        </div>

        <form className="space-y-2" onSubmit={(event) => handleSubmit(event)}>
          <label className="flex flex-col ">
            Email:
            <input
              type="email"
              name="email"
              required
              className="rounded-xl mt-1 p-2"
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
                className="rounded-xl w-full p-2 font-sans font-semibold "
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
            {!loading && (
              <button
                type="submit"
                className="ring-2 rounded-xl h-10 mt-5 bg-secondary-dark text-primary-light"
              >
                Đăng nhập
              </button>
            )}
          </label>
        </form>

        {loading && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Đang xử lý đăng nhập…
          </p>
        )}
        {err && <p className="mt-3 text-center text-sm text-red-600">{err}</p>}
      </div>
    </main>
  );
}
