import Image from "next/image";
import { useEffect } from "react";
import { FaLongArrowAltDown } from "react-icons/fa";
<FaLongArrowAltDown />;

interface IProps {
  src: string;
  close: () => void;
}

export default function PreviewImage({ src, close }: IProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background-dark/70 backdrop-blur-sm flex items-center justify-center"
        onClick={close}
      >
        <div className=" text-white md:hidden cursor-pointer">
          <FaLongArrowAltDown size={40} />
        </div>
        <Image
          src={src}
          alt="Dịch vụ tắm gội , khách sạn"
          width={600}
          height={1200}
          className=" z-50 "
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </>
  );
}
