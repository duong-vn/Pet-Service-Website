"use client";
import { getAT } from "@/lib/authToken";
import { api } from "@/utils/axiosInstance";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ServicesUI() {
  const temp = getAT();
  const [ok,setok] =useState('ok')
  const [at, setAt] = useState(temp);
  const test = async () => {
    const res = await api.delete("/api/appointments/68959fe7a05e87347875ce7d");
    console.log(res);
    console.log(getAT());
  };

  useEffect(()=>{

    console.log('trong usse EFF')

  },[temp])
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // trạng thái ban đầu
      animate={{ opacity: 1, y: 0 }} // trạng thái khi xuất hiện
      exit={{ opacity: 0, y: -50 }} // trạng thái khi biến mất
      transition={{ duration: 0.5 }} // thời gian & easing
      className="p-4 bg-blue-500 text-white rounded"
    >
      Hello Framer Motion!
      <div onClick={test}>HELLO</div>
    </motion.div>
  );
}
