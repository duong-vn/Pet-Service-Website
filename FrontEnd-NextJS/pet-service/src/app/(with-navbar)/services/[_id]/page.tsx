import { isResOk } from "@/apiServices/services"
import NotFound from "@/components/layout/NotFound"
import { api, BASE_URL } from "@/utils/axiosInstance"



export default async function ServicePage ({params}:{params:{_id:string}}){
    const {_id} = await params
    const res = await fetch(`${BASE_URL}/api/services/${_id}`).then(r=>r.json())
    
    if(!isResOk(res.statusCode)) return <NotFound/>
        const serviceData=res.data
        
    return(

        <div>
            {serviceData._id}
        </div>
    )
}