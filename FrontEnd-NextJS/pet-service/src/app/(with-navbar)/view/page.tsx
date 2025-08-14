"use client";

import { postCloud, postSign } from "@/apiServices/cloud/services";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiImages } from "react-icons/bi";
import { FaImages } from "react-icons/fa";

export default function view() {
  const [preview, setPreview] = useState<string>("");
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const tryAxios = async () => {
    const res = await postSign("images/services");
    console.log(">>>>> Res", res);
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);

      setPreview(url);
      const sign = await postSign("images/services");
      console.log(">>> sign", sign);
      const res = await postCloud(file, sign.data);
      console.log("res sau khi thu post len cloud", res);
    }
    console.log(e);
  };
  return (
    // <div>
    //   <button className=" rounded-[20px] border-2 hover:bg-primary-light border-black p-2">
    //     Open Modal
    //   </button>
    // </div>
    <div className="border-2 w-fit h-fit border-primary-light   ">
      <label
        className="flex items-center transtion:all duration-300 hover:scale-105 hover:bg-secondary-light cursor-pointer"
        htmlFor="imageUpload"
      >
        <BiImages size={30} /> Upload image
      </label>
      <input
        type="file"
        accept="image/"
        className="hidden"
        id="imageUpload"
        onChange={(e) => handleUpload(e)}
      />
      {preview ? (
        <Image src={preview} alt="hello" height={100} width="100" />
      ) : (
        <div>No preview</div>
      )}
    </div>
  );
}
