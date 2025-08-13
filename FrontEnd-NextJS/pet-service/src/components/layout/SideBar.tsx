'use client'

import { useSidebar } from "@/context/SidebarContext";
import UserPill from "./UserPill";
import Link from "next/link";
import { FaHome, FaUser, FaShoppingCart, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { FaCalendarDays } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";
import { useRef } from "react";

export default function Sidebar() {
  const { isOpen, close } = useSidebar()
  
  if (!isOpen) return null;
 
const handleClose = ()=>{
    
    close()



}
  return (
    <>
    {/* OVLERLAY */}
      <div className="fixed inset-0 z-40 bg-black/50 xl:bg-black/30" onClick={handleClose}> 
      </div>

                {/* The sidebar */}
            <div className="fixed bg-secondary-light top-0 right-0 z-50 shadow-2xl dark:bg-secondary-dark w-50 h-full transform transition-transform  duration-300 ease-in-out ">
                   {/* header */}
                   <div className="flex justify-between border-b border-neutral-light dark:border-neutral-dark p-8 pb-6 ">
                     <div className="font-display font-bold text-3xl">MENU</div>
                     <div className="font-display font-bold text-3xl cursor-pointer" onClick={handleClose}>X</div>
                   </div>
                   {/* Userpill */}
                   
                   <div className="p-8 flex tems-center border-b border-neutral-light dark:border-neutral-dark">
                            <UserPill/>
                   </div>
                   {/* items  */}
                   <nav className=" border-b border-neutral-light flex flex-col justify-between space-y-2 p-8 dark:border-neutral-dark">
                 
                 
                  <Link href='/' className="flex  pb-3"><FaHome className="w-5 h-5 mr-3" /><span>Trang chủ</span>
                  </Link> 
                  <Link href='/' className="flex  py-3"><MdHomeRepairService  className="w-5 h-5 mr-3" /><span>Dịch vụ</span>
                  </Link> 
                  <Link href='/' className="flex  py-3"><FaCalendarDays className="w-5 h-5 mr-3" /><span>Đặt lịch</span>
                  </Link> 
                  <Link href='/shop' className="flex  pt-3"><FaShoppingCart className="w-5 h-5 mr-3 " />
                  <span className="font-medium">Cửa hàng</span></Link>
                  



                   </nav>
                   <div>
                    <div className="p-8 flex items-center">

                    <FaSignOutAlt className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform text-red-600" />
                    <span className="text-red-600">Đăng xuất</span>
                    </div>
                       

                   </div>
                   

            </div>
      
    </>
  );
}