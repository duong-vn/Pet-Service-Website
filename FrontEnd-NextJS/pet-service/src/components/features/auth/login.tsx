"use client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface IProp {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  setErr: (any: any) => void;
}
export default function Login({ onSuccess, setErr }: IProp) {
  return (
    <>
      <div className="overflow-hidden border border-white/30 rounded-3xl">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => setErr("Google login error. Vui lòng thử lại.")}
          theme="filled_black"
          shape="circle" // pill | rectangular | circle
          logo_alignment="left" // left | center
          width="260"
          useOneTap={true} // bạn có thể bật nếu muốn
          cancel_on_tap_outside
          nonce={"false"}
        />
      </div>
    </>
  );
}
