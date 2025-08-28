import { api } from "@/utils/axiosInstance";
import { handleError } from "../services";
import { toast } from "sonner";

export const patchRoles = async (payload: {
  _id: string;
  name: string;
  description: string;
  permissions: { _id: string; key: string }[];
}) => {
  try {
    const { _id, ...rest } = payload;
    const res = await api.patch("/api/roles/" + payload._id, rest);
    return res;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const postRoles = async (payload: {
  name: string;
  description: string;
  permissions: { _id: string; key: string }[];
}) => {
  try {
    const res = await api.post("/api/roles", payload);
    return res;
  } catch (error) {
    handleError(error);
    return null;
  }
};
