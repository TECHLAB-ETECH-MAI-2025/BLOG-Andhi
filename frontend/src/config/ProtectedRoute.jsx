import { useContext, useEffect } from "react";
import { AuthContext, verifyToken } from "./AuthContext";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
	const { user, logout } = useContext(AuthContext);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const decoded = verifyToken(token);
		if (token && decoded?.isExpired && !decoded.user) {
			logout();
			return;
		}
	}, []);

	return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
