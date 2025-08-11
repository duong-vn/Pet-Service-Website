"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
      className="rounded-2xl p-4 cursor-pointer"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
