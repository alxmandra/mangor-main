import { ReactNode, createContext, useContext, useState } from "react"
export interface User {
    [x:string]:string
};
export type GlobalContent = {
  user: User | null
  setUser:React.Dispatch<React.SetStateAction<User | null>>;
};


export const Context = createContext<GlobalContent>({
user: null, // set a default value
setUser: () => {},
})

export const GlobalUserContext = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
  
    return (
      <Context.Provider value={{ user, setUser }}>
        {children}
      </Context.Provider>
    );
  };

export const useGlobalUserContext = () => useContext(Context)