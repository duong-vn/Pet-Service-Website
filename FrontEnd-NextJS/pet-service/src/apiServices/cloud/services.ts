import axios from "axios";
import { ApiResponse, handleError } from "../services";
import { BASE_URL } from "@/utils/axiosInstance";
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
interface ISign {
  timestamp: string;
  folder: string;
  signature: string;
  cloudName: string;
  apiKey: string;
  public_id?: string;
  uploadPreset: string;
}
interface IResData {
  public_id: string;
  secure_url: string;
}

export const postSign = async (
  folder: string,
  publicId?: string
): Promise<ApiResponse<ISign>> => {
  const res = await axios.post<ApiResponse<ISign>>(
    `${BASE_URL}/api/cloud/sign`,
    {
      folder,
      public_id: publicId,
    }
  );
  return res.data;
};
export const postCloud = async (
  file: File,
  sign: ISign,
  public_id?: string
): Promise<IResData> => {
  const { timestamp, signature, folder, apiKey, uploadPreset } = sign;
  const form = new FormData();
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("file", file);
  form.append("signature", signature);
  form.append("api_key", apiKey);
  form.append("upload_preset", uploadPreset);
  if (public_id) {
    form.append("public_id", public_id);
  }

  const res = await axios.post(CLOUD_URL, form);
  const { public_id: pi, secure_url } = res.data;
  const pl = pi
    .replace(/\/+$/, "")
    .slice(pi.replace(/\/+$/, "").lastIndexOf("/") + 1);

  return {
    public_id: pl,
    secure_url,
  };
};

export const uploadToCloud = async (
  folder: string,
  file: File,
  public_id?: string
): Promise<IResData> => {
  try {
    const sign = await postSign(folder, public_id);
    return await postCloud(file, sign.data, public_id);
  } catch (error) {
    handleError(error);
    return {
      public_id: "",
      secure_url: "/images/placeholders/meo.webp",
    };
  }
};
