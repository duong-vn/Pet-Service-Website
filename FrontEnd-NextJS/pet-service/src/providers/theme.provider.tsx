import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class" // thêm class 'dark' lên <html>
      defaultTheme="system" // theo hệ điều hành
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
