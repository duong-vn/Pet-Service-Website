import axios from "axios";
import { ApiResponse } from "../services";
import { BASE_URL } from "@/utils/axiosInstance";
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
interface ISign {
  timestamp: string;
  folder: string;
  signature: string;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}
interface IResData {
  public_id: string;
  secure_url: string;
}

export const postSign = async (folder: string): Promise<ApiResponse<ISign>> => {
  const res = await axios.post<ApiResponse<ISign>>(
    `${BASE_URL}/api/cloud/sign`,
    { folder }
  );
  return res.data;
};
export const postCloud = async (file: File, sign: ISign): Promise<IResData> => {
  const { timestamp, signature, folder, cloudName, apiKey, uploadPreset } =
    sign;
  const form = new FormData();
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("file", file);
  form.append("signature", signature);
  form.append("api_key", apiKey);
  form.append("upload_preset", uploadPreset);

  const res = await axios.post(CLOUD_URL, form);
  return res.data;
};

export const uploadToCloud = async (
  folder: string,
  file: File
): Promise<IResData> => {
  const sign = await postSign(folder);
  return await postCloud(file, sign.data);
};
