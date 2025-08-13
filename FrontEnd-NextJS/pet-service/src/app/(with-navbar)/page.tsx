"use client";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="mt-5 xl:p-6 w-screen bg-accent-light dark:bg-secondary-dark flex justify-between items-center rounded-3xl shadow-2xl ">
        <div>
          <Image
            src="/images/icons/cool_dog.webp"
            alt=""
            width={300}
            height={300}
            className=" object-cover rounded-3xl transition-all hover:drop-shadow-2xl hover:scale-110"
          />
        </div>
        <Image
          src="/images/icons/ZOZO-cat.png"
          alt=""
          width={900}
          height={900}
          className="mx-auto transition-all hover:drop-shadow-2xl hover:scale-110"
        />
        <div>
          <Image
            src="/images/icons/other.webp"
            alt=""
            width={300}
            height={300}
            className="object-cover rounded-3xl  transition-all hover:shadow-2xl hover:scale-110"
          />
        </div>

        <div className="h-40"></div>
      </div>

      <div className=" w-[90%] xl:w-[60%] relative top-[-40] xl:top-[-90] mx-auto rounded-[70]  bg-neutral-light dark:bg-primary-dark h-[2000px] shadow-2xl">
        <div className="absolute inset-0 m-auto text-center mt-5">
          <h1 className="text-4xl font-bold ">Welcome to our website</h1>
          <p className="text-lg">
            This is a simple landing page with a dark mode toggle.
          </p>
        </div>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et,
        dignissimos.
      </p>
      <p>
        Esse ipsam alias exercitationem, ullam id porro eum accusantium
        mollitia.
      </p>
      <p>
        Aliquid qui illum est culpa laboriosam error, labore beatae voluptas.
      </p>
      <p>
        Laboriosam, nesciunt repellendus suscipit impedit culpa earum aliquam
        maiores architecto.
      </p>
      <p>
        Distinctio, ratione. Autem ea maxime quia labore officia molestias
        facilis.
      </p>
    </>
  );
}
