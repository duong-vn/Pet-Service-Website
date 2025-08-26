import { api } from "@/utils/axiosInstance";
import { handleError } from "../services";

export const postAppointments = async (payload: any) => {
  try {
    const appointments = (await api.post("/api/appointments", payload)).data
      .data;
    return appointments._id;
  } catch (error) {
    handleError(error);
    return null;
  }
};
