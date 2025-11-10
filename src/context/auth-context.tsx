import Cookies from "js-cookie";
import { createContext, useState, useEffect } from "react";
import type { AuthUser } from "../types/auth-user";

interface AuthContextProps {
  user: AuthUser | null | undefined;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) setUser(JSON.parse(storedUser));
  else setUser(null);
}, []);


  async function login(username: string, password: string) {
    const response = await fetch(
      `http://localhost:8080/pacientes/login?username=${username}&password=${password}`
    );

    if (!response.ok) throw new Error("Usuário ou senha inválidos");

    const data: AuthUser = await response.json();

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    Cookies.set("user", JSON.stringify(data));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    Cookies.remove("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
