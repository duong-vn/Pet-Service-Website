"use client";

import { FormEvent, useRef, useState } from "react";
import { CredentialResponse, googleLogout } from "@react-oauth/google";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGoogleLogin } from "@/apiServices/services";
import { setAT } from "@/lib/authToken";
import Login from "@/components/features/auth/login";
import { motion } from "framer-motion";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { localLogin } from "@/apiServices/auth/services";
import { toast } from "sonner";
import Link from "next/link";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { FaArrowRight } from "react-icons/fa";
import "../register/form.css";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { setAuth } from "@/lib/authSlice";
import { GiDogHouse } from "react-icons/gi";
export default function LoginPage() {
  const authenticated = useAppSelector((s) => s.auth.authenticated);
  const [loading, setLoading] = useState(false);
  const [, setErr] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = useRef(searchParams.get("next") ?? "/").current;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setErr(null);
      setLoading(true);

      const credential = credentialResponse?.credential;
      if (!credential) throw new Error("Không nhận được credential từ Google.");

      const { access_token, user } = (await handleGoogleLogin(credential)).data;
      googleLogout();
      setAT(access_token);

      toast.success("Đăng nhập thành công!");

      dispatch(setAuth(user));
      router.replace(next);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Đăng nhập thất bại, thử lại sau.");
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const res = await localLogin(email, password);
    if (res) {
      dispatch(setAuth(res.data.user));
      router.push(next);
    } else {
      setLoading(false);
    }
  };

  if (loading || authenticated === "checking") {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <LoadingScreen />{" "}
      </div>
    );
  }
  if (authenticated === "unauthenticated") {
    return (
      <main>
        <div className="min-h-[100dvh] flex items-center flex-col pt-10 px-4 ">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => router.replace("/")}
          >
            <Image
              src="/images/icons/ZOZO-cat.png"
              alt="ZOZO"
              width={296}
              height={296}
              className="mb-3 animate-pulse"
            />
          </motion.div>

          <div className="w-full max-w-md rounded-3xl  ring-2 ring-neutral-dark  dark:text-neutral-light bg-secondary-dark p-6 shadow-2xl">
            <div className="flex flex-col text-primary-light items-center">
              <h1 className="text-2xl font-bold">Đăng nhập</h1>
              <p className="mt-1 text-sm text-muted-foreground text-center">
                Sử dụng tài khoản Google để tiếp tục.
              </p>
            </div>

            <div className="mt-2 flex justify-center">
              <Login onSuccess={onSuccess} setErr={setErr} />
            </div>

            <div className="text-center pt-4 text-primary-light">
              ----------hoặc----------
            </div>

            <form className="space-y-2" onSubmit={handleSubmit}>
              <label className="flex text-white flex-col">
                Email:
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="rounded-xl bg-white text-black mt-1 p-2 "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="flex flex-col text-white">
                Password:
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="rounded-xl w-full bg-white text-black p-2 font-sans font-semibold"
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
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
                  disabled={loading}
                  type="submit"
                  className="ring-2 rounded-xl h-10 mt-5 mb-5 ring-black/40 dark:ring-white/30 bg-secondary-dark text-primary-light hover:bg-primary-dark"
                >
                  {!loading ? (
                    "Đăng nhập"
                  ) : (
                    <div className="w-5 h-5 m-auto animate-spin rounded-full border-2 border-t-transparent border-primary-light"></div>
                  )}
                </button>
              </label>
            </form>
            <Link
              href="/auth/forget-password"
              className="mt-3 cursor-pointer text-primary-light hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Link
            href="/auth/register"
            className="flex border p-2 rounded-3xl items-center justify-end text-sm mt-5 bg-transparent hover:bg-primary-dark hover:border-secondary-dark hover:scale-105 transition-transform border-transparent text-primary-light"
          >
            <FaArrowRight size={20} className="mx-2 " />
            Bạn chưa có tài khoản? Đăng kí tại đây
          </Link>
          <Link
            href="/"
            className="fixed block top-10 left-10 text-sm mt-5 hover:underline hover:scale-150 transition-transform text-primary-light"
          >
            <GiDogHouse size={30} className="mx-2 " />
          </Link>
        </div>
      </main>
    );
  } else {
    router.replace("/");
  }
}
