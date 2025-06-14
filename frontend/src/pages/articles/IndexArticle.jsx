import { useContext, useEffect, useState } from "react";
import {
	Button,
	Col,
	Container,
	Form,
	Image,
	InputGroup,
	Row,
	Spinner,
	Stack,
} from "react-bootstrap";
import { BsInbox, BsSearch } from "react-icons/bs";
import { AuthContext } from "../../config/AuthContext";
import { API } from "../../config/Up";
import Navbar from "../../components/Navbar";
import ArticleCard from "../../components/ArticleCard";
import { useNavigate } from "react-router";

function IndexArticle() {
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	const [topArticles, setTopArticles] = useState(null);
	const [recentArticles, setRecentArticles] = useState(null)

	const [search, setSearch] = useState("");
	const [searchArticles, setSearchArticle] = useState({
		isSearching: false,
		query: "",
		articles: [],
	});

	const handleInputSearchChange = (e) => {
		const { value } = e.target;

		setSearch(value);

		if (!value.trim()) {
			setSearchArticle({
				isSearching: false,
				query: "",
				articles: [],
			});
			return;
		}
	};

	const handleSubmitSearch = (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		if (!form.checkValidity()) {
			e.stopPropagation();
		}
		if (search) {
			setSearchArticle((prevState) => ({
				...prevState,
				isSearching: true,
				query: search,
			}));

			API(token)("/articles/search?s=" + search)
				.then((res) => {
					if (!res.success) {
						console.log(res.message);
						return;
					}
					setSearchArticle({
						isSearching: true,
						query: search,
						articles: res.data.articles,
					});
				})
				.catch((err) => {
					console.error(err.message);
				});
		}
	};

	useEffect(() => {
		API(token)("/articles")
			.then((res) => {
				if (!res.success) {
					setTopArticles([]);
					return;
				}
				setTopArticles(res.data.articles);
				setRecentArticles(res.data.articles);
			})
			.catch((err) => {
				console.error(err.message);
			});
	}, []);

	return (
		<>
			<Navbar />
			<main>
				<Container>
					<div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5 mb-3 pb-3">
						<Form className="w-50" onSubmit={handleSubmitSearch}>
							<Form.Label htmlFor="search" className="w-100 text-center">
								<div className="d-flex align-items-center justify-content-center gap-2">
									<div className="d-table rounded-circle overflow-hidden">
										<Image src="/logo.png" alt="Daily Blog logo" width={50} />
									</div>
									<strong className="fs-1 text-primary">Daily Blog</strong>
								</div>
							</Form.Label>
							<InputGroup>
								<Form.Control
									type="search"
									placeholder="Search article here..."
									className="border-1 border-secondary px-4 py-2"
									value={search}
									onChange={handleInputSearchChange}
									required={true}
								/>
								<Button
									type="submit"
									variant="outline-secondary"
									className="border-1"
								>
									<BsSearch size={25} />
								</Button>
							</InputGroup>
							<div className="text-center">
								<div className="my-2">
									<span>Or</span>
								</div>
								<Button className="rounded-pill px-5" onClick={() =>navigate("/article/new")}>
									<strong className="fs-4">Create an article</strong>
								</Button>
							</div>
						</Form>
					</div>

					{searchArticles.isSearching ? (
						<div className="my-5">
							{searchArticles.articles && (
								<h2>Result of "{searchArticles.query}" :</h2>
							)}
							<Stack gap={2}>
								{searchArticles.articles ? (
									searchArticles.articles.map((article) => {
										return (
											<ArticleCard
												key={article.id}
												article={article}
												isRecent={true}
											/>
										);
									})
								) : (
									<div className="text-center mt-4">
										<Spinner animation="border" variant="primary" />
									</div>
								)}
							</Stack>
						</div>
					) : (
						<>
							<div className="my-5">
								<h2>Top 3 related</h2>
								{topArticles === null ? (
									<div className="text-center mt-4">
										<Spinner animation="border" variant="primary" />
									</div>
								) : !topArticles?.length ? (
									<Stack className="d-flex align-items-center text-center my-4">
										<BsInbox size={50} className="text-secondary" />
										<span className="fs-5">No article at the moment</span>
									</Stack>
								) : (
									<Row lg={3}>
										{topArticles.map((article) => {
											return (
												<Col key={article.id}>
													<ArticleCard
														article={article}
														isRecent={false}
													/>
												</Col>
											);
										})}
									</Row>
								)}
							</div>

							<div>
								<h2>Recents articles</h2>
								{!recentArticles === null ? (
									<div className="text-center mt-4">
										<Spinner animation="border" variant="primary" />
									</div>
								) : !recentArticles?.length ? (
									<Stack className="d-flex align-items-center text-center my-4">
										<BsInbox size={50} className="text-secondary" />
										<span className="fs-5">No article at the moment</span>
									</Stack>
								) : (
									<Row lg={3}>
										{recentArticles.map((article) => {
											return (
												<Col key={article.id}>
													<ArticleCard
														article={article}
														isRecent={true}
													/>
												</Col>
											);
										})}
									</Row>
								)}
							</div>
						</>
					)}
				</Container>
			</main>
		</>
	);
}

export default IndexArticle;
