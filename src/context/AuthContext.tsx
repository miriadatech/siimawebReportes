import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import api from "../services/api";


export type User = {
id?: string;
name: string;
email: string;
role?: string;
};


type AuthContextType = {
user: User | null;
token: string | null;
login: (email: string, password: string) => Promise<void>;
logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);


useEffect(() => {
// Cargar desde localStorage
const t = localStorage.getItem("auth_token");
const u = localStorage.getItem("auth_user");
if (t) setToken(t);
if (u) setUser(JSON.parse(u));
}, []);


const login = async (email: string, password: string) => {

const { data } = await api.post("/auth/login", { username: email, password });
const t = data?.accesToken as string;
const u = data?.codigo as User;


if (!t || !u) throw new Error("Respuesta de login inválida");


localStorage.setItem("auth_token", t);
localStorage.setItem("auth_user", JSON.stringify(u));
setToken(t);
setUser(u);
message.success(`Bienvenido ${u.name}`);
};


const logout = () => {
localStorage.removeItem("auth_token");
localStorage.removeItem("auth_user");
setToken(null);
setUser(null);
};


const value = useMemo(() => ({ user, token, login, logout }), [user, token]);


return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
return ctx;
}