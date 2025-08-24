import { IService } from "@/types/back-end"
import { handleError } from "../services"
import { api } from "@/utils/axiosInstance"
import { toast } from "sonner"
import { PriceRule } from "@/app/(with-navbar)/services/[_id]/PriceRuleModal"

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

export const postPriceRules= async (payload : PriceRule) =>{
    try {
        const res = (await api.post('/api/price-rules',payload)).data
        return res
    } catch (error) {
        handleError(error)
        return null
    }


}

export const patchPriceRules= async (_id:string,payload : PriceRule) =>{
    try {
        const res = (await api.patch(`/api/price-rules/${_id}`,payload)).data
        return res
    } catch (error) {
        handleError(error)
        return null
    }


}
export const deletePriceRules = async (_id:string) =>{

        try{
            const res = await api.delete(`/api/price-rules/${_id}`)
return res;
        }catch(error){
            handleError(error)
            return null
        }

}   