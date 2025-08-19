// "use client";

// import {
//   postCloud,
//   postSign,
//   uploadToCloud,
// } from "@/apiServices/cloud/services";
// import { CldUploadButton } from "next-cloudinary";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { BiImages } from "react-icons/bi";
// import { FaImages } from "react-icons/fa";

// export default function view() {
//   // const [preview, setPreview] = useState<string | null>(null);

//   // const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   var file = e.target.files?.[0];
//   //   if (file){
//   //     setPreview(URL.createObjectURL(file));
//   //     uploadToCloud('place/holder',file)
//   //   }
//   // };

//   // const onConfirm = () =>{
//   //   uploadToCloud('', file)
//   // }

//   return (
//     // <div>
//     //   <button className=" rounded-[20px] border-2 hover:bg-primary-light border-black p-2">
//     //     Open Modal
//     //   </button>
//     // </div>
//     <div className="border-2 w-fit h-fit border-primary-light   ">
//       <label
//         className="flex items-center transtion:all duration-300 hover:scale-105 hover:bg-secondary-light cursor-pointer"
//         htmlFor="imageUpload"
//       >
//         <BiImages size={30} /> Upload image
//       </label>
//       <input
//         type="file"
//         accept="image/"
//         className="hidden"
//         id="imageUpload"
//         onChange={handleOnchange}
//       />

//       {preview && (
//         <Image
//           src={preview}
//           alt="Service's preview image"
//           height={100}
//           width="100"
//         />
//       )}
//     </div>
//   );
// }
