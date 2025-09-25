import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ThemeContextType
{
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps
{
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps)
{
  const getInitialTheme = (): "light" | "dark" =>
  {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark")
    {
      return "dark";
    }
    return "light";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() =>
  {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType =>
{
  const context = useContext(ThemeContext);
  if (!context)
  {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
