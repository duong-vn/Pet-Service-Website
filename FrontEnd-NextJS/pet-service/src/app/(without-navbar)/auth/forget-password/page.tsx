"use client";
import { isVerified } from "@/apiServices/auth/services";
import ResetPass from "@/components/features/auth/ResetPass";
import SendEmailFP from "@/components/features/auth/SendEmailFP";
import LoadingScreen from "@/components/ui/LoadingScreen";

import { useEffect, useState } from "react";

export default function ForgetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setToken(hash);
      return;
    }

    setToken(hash);
    setVerifying(true);
    (async () => {
      const ok = await isVerified(hash);
      setVerified(!!ok);
      setVerifying(false);
    })();

    history.replaceState({}, "", "forget-password");
  }, []);

  if (verifying)
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <LoadingScreen />{" "}
      </div>
    );

  if (!token) return <SendEmailFP />;
  if (!verified) return <SendEmailFP />;
  return <ResetPass token={token} />;
}
