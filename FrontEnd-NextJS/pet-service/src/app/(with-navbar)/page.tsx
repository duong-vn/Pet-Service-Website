"use client";

import { CldImage } from "next-cloudinary";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="mt-5 xl:p-6 w-screen bg-secondary-light dark:bg-primary-dark flex justify-between items-center rounded-3xl shadow-2xl ">
        <div>
          <Image
            src="/images/icons/cool_dog.webp"
            alt=""
            width={300}
            height={300}
            className=" hidden xl:flex object-cover rounded-3xl transition-all hover:drop-shadow-2xl hover:scale-110"
          />
        </div>
        <Image
          src="/images/icons/ZOZO-cat.png"
          alt=""
          width={900}
          height={900}
          className="mx-auto transition-all z-1 hover:drop-shadow-2xl hover:scale-110"
        />
        <div>
          <Image
            src="/images/icons/other.webp"
            alt=""
            width={300}
            height={300}
            className="object-cover hidden xl:flex rounded-3xl  transition-all hover:shadow-2xl hover:scale-110"
          />
        </div>

        <div className="h-40"></div>
      </div>

      {/* card */}
      <div className=" w-[100%] xl:w-[60%]  xl:-mt-24 top-[-90] mx-auto rounded-[70]  bg-neutral-light dark:bg-secondary-dark  shadow-2xl">
        {/* content */}
        <div>
          <h1 className="text-5xl pt-10  text-center  p-5 xl:text-7xl xl:w-[70%] text-primary-dark dark:text-primary-light">
            Boss đẹp – Sen vui, đến ZOZO thôi!
          </h1>
          <div className=" xl:flex xl:mx-10 border-b-2 border-background-light">
            <p className="text-lg pb-6 p-3 flex items-center xl:leading-10 xl:relative xl:top-[-90px] hover:scale-105 transition-all hover:font-extrabold">
              Tại đây, bạn có thể dễ dàng lựa chọn các dịch vụ như tắm rửa, tỉa
              lông, cắt móng hay spa cho thú cưng và đặt lịch trực tiếp ngay
              trên website. Chỉ với vài thao tác đơn giản, thú cưng của bạn sẽ
              được chăm sóc tận tình bởi đội ngũ chuyên nghiệp. Bắt đầu ngay hôm
              nay để boss cưng của bạn được yêu thương và chăm sóc tốt nhất!
            </p>
            <Image
              src="/images/ui/dog_showering.webp"
              alt="do"
              height={500}
              width={500}
              className="shadow-2xl mx-auto mb-6 rounded-3xl xl:rounded-full xl:relative xl:top-[-90] "
            />
          </div>
          <h2 className="text-3xl xl:text-5xl p-10">
            Các dịch vụ hiện đang có trên hệ thống:
          </h2>
        </div>
      </div>
    </>
  );
}
