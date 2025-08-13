"use client";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="mt-5  border-t border-b bg-secondary-light dark:bg-secondary-dark border-neutral-light shadow-inset-lg flex justify-center ">
        <Image
          src="/images/icons/Logo.webp"
          alt=""
          width={900}
          height={900}
          className=""
        />
      </div>

      <div className="flex justify-center items-center  h-[2000px]">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to our website</h1>
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
