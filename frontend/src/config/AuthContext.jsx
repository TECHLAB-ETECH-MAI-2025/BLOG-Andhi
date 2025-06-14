import { createContext, useState } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	const tokenDecoded = verifyToken(token);

	const [user, setUser] = useState(tokenDecoded ? tokenDecoded.user : null);

	const login = (userData, userToken) => {
		setUser(userData);
		localStorage.setItem("token", userToken);
	};

	// remove token, and set user to null on logout
	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ token, user, setUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

const verifyToken = (token) => {
	if (!token) {
		return null;
	}
	let payload = token.split(".");
	if (!payload) {
		return null;
	}

	return {
		user: JSON.parse(atob(payload[0])),
		isExpired: JSON.parse(atob(payload[1])).expDate > Date.now() + 1000,
	};
};

export { AuthContext, AuthProvider, verifyToken };
