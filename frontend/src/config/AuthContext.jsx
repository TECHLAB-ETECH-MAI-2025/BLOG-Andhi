import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
	const navigate = useNavigate();
	const [token, setToken] = useState("");
	const [user, setUser] = useState(null);

	const saveToken = (token) => {
		setToken(token);
		localStorage.setItem("token", token);
	}

	const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        // remove token on logout
        localStorage.removeItem("token");
        setUser(null);
    };

	useEffect(() => {
	}, [])

	return <AuthContext.Provider value={{token, login}}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };