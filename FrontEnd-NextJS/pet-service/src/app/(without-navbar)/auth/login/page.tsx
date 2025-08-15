"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleGoogleLogin } from "@/apiServices/services"; // bạn đã có
import { setAT } from "@/lib/authToken";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
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

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center">
          <Image
            src="/images/icons/ZOZO-cat.png"
            alt="ZOZO"
            width={96}
            height={96}
            className="mb-3"
          />
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="mt-1 text-sm text-muted-foreground text-center">
            Sử dụng tài khoản Google để tiếp tục.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => setErr("Google login error. Vui lòng thử lại.")}
            theme="outline" // light | filled_black | outline
            shape="pill" // pill | rectangular | circle
            logo_alignment="left" // left | center
            width="280"
            useOneTap={false} // bạn có thể bật nếu muốn
          />
        </div>

        {loading && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Đang xử lý đăng nhập…
          </p>
        )}
        {err && <p className="mt-3 text-center text-sm text-red-600">{err}</p>}

        <div className="mt-6 text-xs text-center text-muted-foreground">
          Khi tiếp tục, bạn đồng ý với{" "}
          <a className="underline underline-offset-4" href="/terms">
            Điều khoản
          </a>{" "}
          &{" "}
          <a className="underline underline-offset-4" href="/privacy">
            Chính sách bảo mật
          </a>
          .
        </div>
      </div>
    </main>
  );
}
