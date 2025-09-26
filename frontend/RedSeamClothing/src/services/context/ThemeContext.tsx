import
  {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
  } from "react";

type Theme = "light" | "dark";

interface ThemeContextType
{
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps
{
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps)
{
  const getInitialTheme = (): Theme =>
    (localStorage.getItem("theme") as Theme) || "light";

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() =>
  {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
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

export function useTheme(): ThemeContextType
{
  const context = useContext(ThemeContext);
  if (!context)
  {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
