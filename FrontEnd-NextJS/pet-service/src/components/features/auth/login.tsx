"use client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface IProp {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  setErr: (any: any) => void;
}
export default function Login({ onSuccess, setErr }: IProp) {
  return (
    <>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => setErr("Google login error. Vui lòng thử lại.")}
        theme="filled_black" // light | filled_black | outline
        shape="circle" // pill | rectangular | circle
        logo_alignment="left" // left | center
        width="280"
        useOneTap={false} // bạn có thể bật nếu muốn
      />
    </>
  );
}
