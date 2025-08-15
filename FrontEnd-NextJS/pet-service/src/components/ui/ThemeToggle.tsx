"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // tránh mismatch icon/text
  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
      className="hover:p-3 transition-all duration-100"
    >
      {theme === "dark" ? (
        <FaSun className="text-yellow-400 " size={28} />
      ) : (
        <FaMoon className="text-gray-900" size={28} />
      )}
    </button>
  );
}
