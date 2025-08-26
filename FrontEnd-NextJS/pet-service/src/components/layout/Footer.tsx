import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-light z-30 dark:bg-primary-dark mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Mô tả */}
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/icons/ZOZO-cat.png"
              alt="ZOZO logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h2 className="text-xl font-display">ZOZO Pet's Service</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed ">
            Nền tảng đặt lịch dịch vụ chăm sóc thú cưng nhanh chóng và tiện lợi.
            Boss đẹp – Sen vui, đến ZOZO thôi!
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:underline">
                Dịch vụ
              </Link>
            </li>
            <li>
              <Link
                href="/appointmentsappointments"
                className="hover:underline"
              >
                Đặt lịch
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                Về chúng tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* service */}

        {/* info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 996 Đường Láng, Đống Đa, Hà Nội</li>
            <li>📞 0886.535.580</li>
            <li>✉️ vutrunghieu121@gmail.com</li>
          </ul>
        </div>
        <div>
          <p>Website này được tạo bởi:</p>

          <a
            href="https://www.facebook.com/nguyen.tuan.duong.523447"
            className="font-display hover:underline "
            target="_blank"
          >
            {" "}
            Nguyen Tuan Duong{" "}
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-dark/20 dark:border-primary-light/20 py-4 text-center text-sm">
        © {new Date().getFullYear()} ZOZO Pet's Service. All rights reserved.
      </div>
    </footer>
  );
}
