import { signOut, useSession } from "next-auth/react";
import {createContext, useEffect, useState} from "react";

export const AuthContext = createContext({});

export function AuthContextProvider({children}) {
  const [isLoggedIn, setIsLoggedIn]= useState(false);
  const [user, setUser] = useState(null)
  const { data, status } = useSession();
  useEffect(() => {
        if ( status === 'authenticated' ) {
            setIsLoggedIn(true)
            setUser(data)
        }

    }, [ status, data ])
  
    const logout = () => {
      
      window.localStorage.clear();
      
      signOut();
      // router.reload();
      // Cookies.remove('token');
  }
  return (
    <AuthContext.Provider value={{isLoggedIn,user, logout}}>
      {children}
    </AuthContext.Provider>
  );
}