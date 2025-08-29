"use client";

import { FormEvent, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { isNumericString } from "@/apiServices/services"; // bạn đã có
import "./form.css";
import { motion } from "framer-motion";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { isRegisterable } from "@/apiServices/auth/services";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { GiDogHouse } from "react-icons/gi";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState({
    phone: false,
    pass: false,
    confirm: false,
  });

  const router = useRouter();

  const pherr = !isNumericString(phone) && touched.phone;

  const pwerr = password.length < 6 && touched.pass;

  const cferr = password !== confirmPassword && touched.confirm;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (pwerr || cferr || pherr) {
      setLoading(false);
      return;
    }

    const payload = {
      name,
      picture: "/images/placeholders/User.png",
      email,
      password,
      phone,
    };
    const res = await isRegisterable(payload);

    setLoading(false);
    if (res) router.replace("/auth/verify");
    else setLoading(false);
  };
  if (loading)
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <LoadingScreen />{" "}
      </div>
    );
  return (
    <main className="min-h-[100dvh] flex items-center flex-col pt-10 px-4 text-neutral-light">
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

      <div className="w-full max-w-md max-h-screen rounded-3xl ring-2 ring-neutral-dark  bg-secondary-dark p-6 shadow-2xl">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-primary-light">Đăng Kí</h1>
        </div>

        <form
          className="text-primary-light"
          onSubmit={(event) => handleSubmit(event)}
        >
          <label className="flex flex-col">
            Tên: (username){" "}
            <input
              type="text"
              required
              className="rounded-xl mt-1 p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col mt-2 ">
            SĐT: (0123456789)
            <input
              type=""
              required
              className={[
                "rounded-xl mt-1 p-2",
                pherr ? "ring-2  ring-error" : "",
              ].join(" ")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => {
                setTouched((s) => ({ ...s, phone: true }));
              }}
              inputMode="numeric"
            />
          </label>
          {pherr && (
            <p className=" text-error mt-1">
              Bạn đã nhập không phải là chuỗi số hoặc có khoảng cách{" "}
            </p>
          )}
          <label className="flex flex-col mt-2  ">
            Email: abc@gmail.com
            <input
              type="email"
              name="email"
              required
              className="rounded-xl mt-1 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col mt-2 ">
            Password:
            <div className="relative  mt-1  ">
              <input
                type={showPassword ? "text" : "password"}
                required
                name="password"
                className={[
                  "rounded-xl w-full p-2 font-sans font-semibold  ",
                  pwerr ? "ring-2  ring-error" : "",
                ].join(" ")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => {
                  setTouched((s) => ({ ...s, pass: true }));
                }}
                aria-invalid={pwerr && touched.pass}
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
          </label>
          {pwerr && (
            <p className=" text-error mt-1">
              Mật khẩu phải có ít nhất 6 kí tự{" "}
            </p>
          )}
          <label className="flex flex-col mt-2 ">
            Confirm password:
            <div className="relative  mt-1  ">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                name="password"
                className={[
                  "rounded-xl w-full p-2 font-sans font-semibold ",
                  cferr ? " ring-2  ring-error" : "",
                ].join(" ")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => {
                  setTouched((s) => ({ ...s, confirm: true }));
                }}
                aria-invalid={cferr && touched.confirm}
              />
              <div
                className="absolute items-center right-2 top-1/2 -translate-y-1/2 "
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaRegEye size={20} />
                ) : (
                  <FaRegEyeSlash size={20} />
                )}
              </div>
            </div>
          </label>
          {cferr && (
            <p className=" text-error mt-1">
              Mật khẩu đã nhận không khớp với mật khẩu trên{" "}
            </p>
          )}
          <button
            type="submit"
            className="ring-2 rounded-xl w-full h-10 mt-5 ring-black/40 dark:ring-white/30  bg-secondary-dark text-primary-light hover:bg-primary-dark "
          >
            Đăng ký
          </button>
        </form>
      </div>
      <Link
        href="/auth/login"
        className="flex border p-2 rounded-3xl items-center justify-end text-sm mt-5 bg-transparent hover:bg-primary-dark hover:border-secondary-dark hover:scale-105 transition-transform border-transparent text-primary-light"
      >
        {" "}
        <FaArrowLeft size={20} className="mx-2" />
        Đăng nhập
      </Link>
      <Link
        href="/"
        className="fixed block top-10 left-10 text-sm mt-5 hover:underline hover:scale-150 transition-transform text-primary-light"
      >
        <GiDogHouse size={30} className="mx-2 " />
      </Link>
    </main>
  );
}
