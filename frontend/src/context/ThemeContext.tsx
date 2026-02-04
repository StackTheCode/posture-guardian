import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSettings } from "../hooks/useSettings";

type Theme = "dark" | "light"

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
export const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const { settings, updateSettings } = useSettings();
    const [theme, setThemeState] = useState<Theme>("dark");

    useEffect(() => {
        if (settings?.theme) {
            setThemeState(settings.theme as Theme)
            applyTheme(settings.theme as Theme)
        }
    }, [settings?.theme])

    const applyTheme = async (newTheme: Theme) => {
        const root = document.documentElement;
        if (newTheme == "dark") {
            root.classList.add("dark")
            root.classList.remove("light");
        }
        else {
            root.classList.remove("dark")
            root.classList.add("light")
        }
    }

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme)
        applyTheme(newTheme)
        if(updateSettings){
            await updateSettings({theme:newTheme})
        }
    }

    const toggleTheme = ()=>{
        const newTheme = theme === "dark" ? "light" :"dark"
        setTheme(newTheme)
    }

    return (
        <ThemeContext.Provider value={{theme,toggleTheme,setTheme}}>
   {children}
        </ThemeContext.Provider>
    )
}
export const useTheme= () =>{
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error("useTheme must be used within ThemeProvider")
    
    }
    return context;
}