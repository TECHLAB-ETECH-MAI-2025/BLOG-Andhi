import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./pages/public/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import About from "./pages/public/About";
import Home from "./pages/public/Home";
import Article from "./pages/articles/Article";
import { AuthProvider } from "./config/AuthContext";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
					<Route path="about" element={<About />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
					<Route path="article">
						<Route index element={<Article.IndexArticle />} />
						<Route path=":id" element={<Article.ShowArticle />} />
						<Route
							path="edit/:id"
							element={<Article.NewOrEditArticle newOrEdit="EDIT_ARTICLE" />}
						/>
						<Route
							path="new"
							element={<Article.NewOrEditArticle newOrEdit="NEW_ARTICLE" />}
						/>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
