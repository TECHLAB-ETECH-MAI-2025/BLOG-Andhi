// import { useContext, useEffect } from "react"
// import { AuthContext } from "./AuthContext"
// import { Navigate } from "react-router";

// const ProtectedRoute = () => {
//     const { token, logout } = useContext(AuthContext);

//     useEffect(() => {
//         const token = sessionStorage.getItem("token") || localStorage.getItem("token");
//         const decoded = isTokenExpired(token);
//         if (token && decoded?.isExpired) {
//             logout();
//         }
//         defineRole(decoded?.role);
//     }, []);
//     return user ? children : <Navigate to="/login" />;
// }