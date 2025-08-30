import { createContext, useState, useEffect } from "react";
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [marketUuid, setMarketUuid] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const storedMarketUuid = localStorage.getItem("market_uuid");

        if (token) {
            axiosInstance.get("/auth/me")
                .then((res) => {
                    setUser(res.data);
                    if (storedMarketUuid) {
                        setMarketUuid(storedMarketUuid);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("market_uuid");
                    setUser(null);
                    setMarketUuid(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const res = await axiosInstance.post("/users/login", { username, password });
        localStorage.setItem("access_token", res.data.access_token);
        setUser(res.data.user);
        // Admin login does not return a market_uuid
        setMarketUuid(null); 
        localStorage.removeItem("market_uuid");
    };

    const loginMarketOwner = async (username, password) => {
        const res = await axiosInstance.post("/users/login/market", { username, password });
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("market_uuid", res.data.market_uuid);
        setUser(res.data.user);
        setMarketUuid(res.data.market_uuid);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("market_uuid");
        setUser(null);
        setMarketUuid(null);
    };

    const value = {
        user,
        marketUuid,
        loading,
        login,
        loginMarketOwner,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
