import Image from "next/image";

export default function HeroCard() {
  return (
    <div className="transition-color duration-700 xl:p-6 w-screen bg-gradient-to-b from-primary-light  to-background-light dark:from-primary-dark  dark:to-background-dark dark:bg-primary-dark flex justify-between items-center rounded-3xl overflow-hidden">
      <Image
        src="/images/icons/cool_dog.png"
        alt="cool dog"
        width={300}
        height={300}
        className="hidden xl:flex object-cover rounded-3xl "
      />

      <Image
        src="/images/icons/ZOZO-cat.png"
        alt="zozo cat"
        width={900}
        height={900}
        className="mx-auto z-20 hover:scale-105 transition-transform "
      />

      <Image
        src="/images/icons/other.png"
        alt="other"
        width={300}
        height={300}
        className="object-cover hidden xl:flex rounded-3xl "
      />
    </div>
  );
}
