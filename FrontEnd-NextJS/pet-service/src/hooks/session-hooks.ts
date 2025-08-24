import { handleError } from "@/apiServices/services";
import { useCallback, useEffect, useState } from "react";

const isBrowser = () => typeof window !== "undefined";
export function useSession<T>(key:string,initial : T){

    
    const [value,setValue] = useState(() =>{
        if (!isBrowser()) return initial;
        try {
          const value =  sessionStorage.getItem(key);
            if(!value) return initial
            return JSON.parse(value)
        } catch (error) {
            handleError(error)
            return initial;
        }

    })

    const clear = useCallback(()=>{
if(!isBrowser()) return
try{
    sessionStorage.removeItem(key)
}catch(error){
    handleError(error)
}
        
    },[key,value])
    useEffect(()=>{
        if (!isBrowser()) return;
        try{
            sessionStorage.setItem(key,JSON.stringify(value))

        }catch(error){
            handleError(error)
        }
setValue(initial)
    },[key,value])

    return [value,setValue,clear] as const
}