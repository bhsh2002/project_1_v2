import { createContext, useState, useEffect } from "react";
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
            axiosInstance.get("/auth/me")
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    localStorage.removeItem("access_token");
                    setUser(null);
                })
                .finally(() => { setLoading(false); console.log("Finished auth check", user) });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const res = await axiosInstance.post("/auth/login", { username, password });
        localStorage.setItem("access_token", res.data.access_token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
