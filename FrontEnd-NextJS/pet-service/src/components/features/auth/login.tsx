"use client";
import { GoogleLogin } from "@react-oauth/google";
import { handleGoogleLogin } from "../apiServices/services";

export default function Login() {
  return (
    <div>
      <h2>Login with google</h2>

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const { credential } = credentialResponse;
          console.log(credential);
          window.alert("success");
          handleGoogleLogin(credential!);
        }}
        onError={() => window.alert("error")}
      />
    </div>
  );
}
