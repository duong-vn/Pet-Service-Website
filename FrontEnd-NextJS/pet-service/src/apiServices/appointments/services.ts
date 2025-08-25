import { api } from "@/utils/axiosInstance"
import { handleError } from "../services"

export const postAppointments = async (payload:any)=>{

    try {
        const appointments = (await api.post('/api/appointments',payload)).data
        return appointments
    } catch (error) {
        handleError(error)
        return null
    }
   
}