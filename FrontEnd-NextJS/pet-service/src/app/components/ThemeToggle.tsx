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
  console.log(theme);
  console.log('resolved theme',resolvedTheme);
  return (
    <button
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
      className="absolute top-1   cursor-pointer"
    >
     {theme === "dark" ? (
        <FaSun className="text-yellow-400"  />
      ) : (
        <FaMoon className="text-gray-900"  />
      )}
    </button>
  );
}
