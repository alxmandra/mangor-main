import { ReactNode, createContext, useContext, useState } from "react";
import themes from "../configs/theme/themes";
export interface theme {
    [x:string]:string
};
export type GlobalContent = {
  theme: theme | null
  setTheme:React.Dispatch<React.SetStateAction<theme | null>>;
};

export const Context = createContext<GlobalContent>({
theme: null, // set a default value
setTheme: () => {},
})

export const GlobalThemeContext = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<theme | null>(themes[0]);
  
    return (
      <Context.Provider value={{ theme, setTheme }}>
        {children}
      </Context.Provider>
    );
  };

export const useGlobalThemeContext = () => useContext(Context)