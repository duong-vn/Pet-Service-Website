import { IService } from "@/types/back-end"
import { handleError } from "../services"
import { api } from "@/utils/axiosInstance"
import { toast } from "sonner"

export const postServices = async (payload:IService)=>{
        try{
            await api.post('/api/services',payload)
            toast.success('Tạo dịch vụ thành công!')
        }catch(error){
            handleError(error)
        }
}

export const patchService = async (_id:string,payload:IService)=>{
    try{
        await api.patch(`/api/services/${_id}`,payload)
            toast.success('Tạo dịch vụ thành công!')
    }catch(error){
        handleError(error)
    }

}

export const deleteServices = async (id:string,public_id:string) =>{
    try{await api.delete(`/api/services/${id}`)
    await api.delete(`api/cloud/delete`,{params:{public_id}})
    toast.success('Xóa thành công')

}catch(error){
    handleError(error)
}

}