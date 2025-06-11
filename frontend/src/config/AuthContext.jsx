import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
	const [token, setToken] = useState("");

	const saveToken = (t) => {
		setToken(t);
		// localStorage.setItem("token", t);
	}

	return <AuthContext.Provider value={{token, saveToken}}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };