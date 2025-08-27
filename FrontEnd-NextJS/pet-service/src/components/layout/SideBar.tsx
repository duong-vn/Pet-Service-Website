"use client";

import { useSidebar } from "@/context/SidebarContext";
import UserPill from "./UserPill";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";

import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { logout } from "@/apiServices/auth/services";
import { can, clearAuth } from "@/lib/authSlice";
import { useState } from "react";
import { PERMISSIONS } from "@/types/permissions";
import { MdOutlineDashboardCustomize } from "react-icons/md";

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const authenticated = useAppSelector((s) => s.auth.authenticated);
  const permissions = useAppSelector((s) => s.auth.user?.permissions);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    setLoading(true);
    const res = await logout();
    if (res) dispatch(clearAuth());

    setLoading(false);
  };

  const handleClose = () => {
    close();
  };

  return (
    <>
      {/* OVLERLAY */}
      <div
        className={[
          "  bg-black/50 xl:bg-black/30 transition-opacity duration-300 overflow-hidden ",
          isOpen ? "opacity-100 z-40 fixed inset-0 " : "opacity-0 z-0",
        ].join(" ")}
        onClick={handleClose}
      ></div>

      {/* The sidebar */}
      <div
        className={[
          "fixed bg-secondary-light top-0 right-0 z-50 min-w-[30dvh] shadow-xl dark:bg-secondary-dark back  h-full transform transition-transform  duration-300 ease-in-out ",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* header */}
        <div className="flex justify-between border-b-2 shadow-lg rounded-xl border-background-light dark:border-neutral-dark p-6 px-8  ">
          <div className="font-display font-bold text-3xl hover:scale-150 transition-transform">
            MENU
          </div>
          <div
            className="font-display font-bold text-3xl cursor-pointer hover:scale-150 transition-transform "
            onClick={handleClose}
          >
            X
          </div>
        </div>
        {loading ? (
          <div className="w-5 h-5 my-10 mx-auto rounded-full border border-t-transparent animate-spin"></div>
        ) : (
          <div className="p-6 flex items-center justify-center border-background-light dark:border-neutral-dark">
            <UserPill />
          </div>
        )}

        {/* items  */}
        <nav className=" border-b-2 border-t-2 rounded-3xl border-background-light flex flex-col justify-between   dark:border-neutral-dark">
          <Link
            href="/"
            className="flex group transition-transform hover:translate-x-2 items-center p-8 py-5 dark:hover:bg-primary-dark hover:bg-primary-light rounded-3xl"
          >
            <FaHome className="w-5 h-5 mr-3 " />
            <span>Trang chủ</span>
          </Link>
          <Link
            href="/services"
            className="flex pl-8 py-5 transition-transform hover:translate-x-2 items-center dark:hover:bg-primary-dark hover:bg-primary-light rounded-3xl"
          >
            <MdHomeRepairService className="w-5 h-5 mr-3" />
            <span>Dịch vụ</span>
          </Link>
          <Link
            href="/appointments"
            className="flex  pl-8 py-5 transition-transform hover:translate-x-2 items-center dark:hover:bg-primary-dark hover:bg-primary-light rounded-3xl "
          >
            <FaCalendarDays className="w-5 h-5 mr-3" />
            <span>Đặt lịch</span>
          </Link>
          <Link
            href="/shop"
            className="flex  p-8 py-5 transition-transform hover:translate-x-2 items-center dark:hover:bg-primary-dark hover:bg-primary-light rounded-3xl"
          >
            <FaShoppingCart className="w-5 h-5 mr-3 " />
            <span className="font-medium">Cửa hàng</span>
          </Link>
        </nav>
        <div>
          {authenticated === "authenticated" && (
            <div
              onClick={handleLogout}
              className="mb-3 mt-1 p-5 flex transition-transform hover:translate-x-2 items-center text-red-600 hover:animate-pulse dark:hover:bg-primary-dark hover:bg-primary-light rounded-3xl"
            >
              <FaSignOutAlt className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform " />
              <span>Đăng xuất</span>
            </div>
          )}
        </div>
        {can(permissions, PERMISSIONS.APPOINTMENTS_PATCH) && (
          <Link
            prefetch
            href="/dashboard"
            className="flex items-end p-5 py-5 transition-transform my-auto hover:translate-x-2  dark:hover:bg-primary-dark hover:bg-primary-light rounded-3xl"
          >
            <MdOutlineDashboardCustomize className="w-5 h-5 mr-3 text-black" />
            <span className="font-medium text-black">Dashboard</span>
          </Link>
        )}
      </div>
    </>
  );
}
