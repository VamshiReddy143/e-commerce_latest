"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider attribute="class"  defaultTheme="system" enableSystem disableTransitionOnChange {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;