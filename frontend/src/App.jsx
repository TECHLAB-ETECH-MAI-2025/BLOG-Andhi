import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./config/AuthContext";
import ProtectedRoute from "./config/ProtectedRoute";
import Public from "./pages/public/Public";
import Auth from "./pages/auth/Auth";
import Article from "./pages/articles/Article";
import User from "./pages/user/User";
import Category from "./pages/categories/Category";

function App() {
	const routes = [
		// Public page
		{ path: "", element: <Public.Home />, public: true },
		{ path: "about", element: <Public.About />, public: true },
		{ path: "contact", element: <Public.Contact />, public: true },
		
		// Auth page
		{ path: "login", element: <Auth.Login />, public: true },
		{ path: "register", element: <Auth.Register />, public: true },

		// User page
		{ path: "user/:id", element: <User.UserProfile />, public: false },

		// Article page
		{ path: "article", element: <Article.IndexArticle />, public: false },
		{ path: "article/:id", element: <Article.ShowArticle />, public: false },
		{ path: "article/new", element: <Article.NewOrEditArticle newOrEdit="NEW_ARTICLE" />, public: false },
		{ path: "article/edit/:id", element: <Article.NewOrEditArticle newOrEdit="EDIT_ARTICLE" />, public: false },

		// Category page
		{ path: "category", element: <Category.IndexCategory />, public: false },
		{ path: "category/:id", element: <Category.ShowCategory />, public: false },
		{ path: "category/new", element: <Category.NewOrEditCategory newOrEdit="NEW_CATEGORY" />, public: false },
		{ path: "category/edit/:id", element: <Category.NewOrEditCategory newOrEdit="EDIT_CATEGORY" />, public: false },

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
					<Route path="*" element={<Public.NotFound />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
