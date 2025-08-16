"use client";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [msg, setMsg] = useState("Đang xác minh…");

  useEffect(() => {
    const token = window.location.hash.slice(1); // phần sau '#'
    if (!token) {
      setMsg("Thiếu token");
      return;
    }
    window.alert(token);
    // Xóa token khỏi URL cho sạch (không reload trang)
    history.replaceState({}, "", "/verify-email");

    (async () => {
      try {
        // const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/verify', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   credentials: 'include',
        //   body: JSON.stringify({ token }),
        // });
        // const data = await res.json();
        // setMsg(data.ok ? 'Xác minh thành công!' : (data.message || 'Xác minh thất bại'));
      } catch {
        setMsg("Lỗi kết nối máy chủ");
      }
    })();
  }, []);

  return <main className="mx-auto max-w-md p-6 text-center">{msg}</main>;
}
