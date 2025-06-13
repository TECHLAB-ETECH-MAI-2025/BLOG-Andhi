import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./pages/public/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import About from "./pages/public/About";
import Home from "./pages/public/Home";
import Article from "./pages/articles/Article";
import { AuthProvider } from "./config/AuthContext";
import ProtectedRoute from "./config/ProtectedRoute";

function App() {
	const routes = [
		{ path: "", element: <Home />, public: true },
		{ path: "about", element: <About />, public: true },
		// {path: "contact", element: <Contact />, public: true},
		{ path: "login", element: <Login />, public: true },
		{ path: "register", element: <Register />, public: true },
		{ path: "article", element: <Article.IndexArticle />, public: false },
		{ path: "article/:id", element: <Article.ShowArticle />, public: false },
		{ path: "article/new", element: <Article.NewOrEditArticle newOrEdit="NEW_ARTICLE" />, public: false },
		{ path: "article/edit/:id", element: <Article.NewOrEditArticle newOrEdit="EDIT_ARTICLE" />, public: false },
	];
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{routes.map((route, i) => (
						<Route
							key={i}
							path={route.path}
							element={
								route.public ? (
									route.element
								) : (
									<ProtectedRoute>{route.element}</ProtectedRoute>
								)
							}
						/>
					))}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
