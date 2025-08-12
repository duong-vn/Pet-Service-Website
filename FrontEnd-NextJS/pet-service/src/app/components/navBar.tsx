"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import {useEffect, useRef, useState} from "react";

export default function NavBar() {
        const [hidden, setHidden] = useState(false);
        const lastY  = useRef(0);


        useEffect(() => {
            let ticking = false
            const onScroll = () =>{
                if(!ticking){
                    const y = window.scrollY;
                    window.requestAnimationFrame(()=>{
                        const delta = 6;

                        const isNearTop = y < 10
                        const goingDown = y -lastY.current >delta
                        const goingUp = lastY.current - y > 3*delta ;
                        if(goingDown && !isNearTop){
                                setHidden(true);
                        }else if(isNearTop || goingUp){
                            setHidden(false);
                        }
                        console.log('y',y,'isNearTop',isNearTop,'goingUp',goingUp,'goingDown',goingDown,'lastY',lastY);

                        lastY.current = y;
                        ticking = false



                })
                ticking = true;


            }}
        window.addEventListener("scroll", onScroll,{passive:true});

            return () => { window.removeEventListener("scroll", onScroll); };


        },[])

  return (
    <header className={[' w-screen top-0 z-10 pt-5 sticky ','transition-transform duration-700  will-change-transform',hidden?'-translate-y-[calc(100%+1.5rem)] ':'-translate-y-0 '].join(' ')}>
      <nav className=" mx-auto container pr-3 md:px-0  max-w-screen-2xl flex  items-center ">
        <div
          className=" p-3 flex flex-1  items-center justify-between rounded-2xl  bg-white/0 line-height-1
             shadow-lg ring-1 ring-black/30 backdrop-blur-2xl dark:bg-primary-dark bg-primary-light dark:ring-white/70
          "
        >
          <Link
            className="text-3xl font-semibold"
          href="/">ZOZO</Link>


            <Link href=""className='hidden md:flex ' >item</Link>
            <Link href=""className='hidden md:flex '>item</Link>
            <Link href=""className='hidden md:flex '>item</Link>


               <ThemeToggle />








        </div>
          <div className="ml-2 flex-shrink-0 ">
              <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-8 h-8"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
              </button>
          </div>
          <div className="md:hidden">
              <Link href=""></Link>
              <Link href=""></Link>
              <Link href=""></Link>
          </div>
      </nav>

    </header>
  );
}
