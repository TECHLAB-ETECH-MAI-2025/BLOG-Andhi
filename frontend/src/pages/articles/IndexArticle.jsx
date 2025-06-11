import {
    Badge,
	Button,
	Card,
	Col,
	Container,
	Form,
	Image,
	InputGroup,
	Row,
	Spinner,
    Stack,
} from "react-bootstrap";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { BsChatSquareDotsFill, BsClockFill, BsHeartFill, BsSearch } from "react-icons/bs";
import { API } from "../../config/Up";
import { Link } from "react-router";

function SingleArticle({ article, isRecent = true }) {
	return (
		<Card className="rounded-4 overflow-hidden">
			<Card.Body className="p-4">
                {isRecent && (
                    <Stack direction="horizontal" className="d-flex align-items-center gap-2 text-muted mb-2">
                        <BsClockFill /> <span>{new Date().getHours().toString()}h ago</span>
                    </Stack>
                )}
				<Card.Title className="fs-3 text-primary">
                    <Link to={"/article/" + article.id} className="text-decoration-none">{article.title.length > 27 ? article.title.slice(0, 27) + "..." : article.title}</Link>
                </Card.Title>
				<Card.Text>{article.content.length > 47 ? article.content.slice(0, 47) + "..." : article.content}</Card.Text>
                {
                    article.categories.length > 0 &&
                    <Row>
                        {
                            article.categories.map(category => {
                                return (
                                    <Col key={category.id}>
                                        <Badge bg="secondary">{category.name}</Badge>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                }
			</Card.Body>
			<Card.Footer className="bg-white text-muted px-4">
				<Row>
					<Col className="d-flex align-items-center justify-content-end gap-4">
						<div className="align-items-center gap-1">
							<BsHeartFill /> <span>4</span>
						</div>
						<div className="align-items-center gap-1">
							<BsChatSquareDotsFill /> <span>4</span>
						</div>
					</Col>
				</Row>
			</Card.Footer>
		</Card>
	);
}

function IndexArticle() {
	const [topArticles, setTopArticles] = useState([]);
	const [recentArticles, setRecentArticles] = useState([]);

	const [search, setSearch] = useState("");
    const [searchArticles, setSearchArticle] = useState({
        isSearching: false,
        articles: []
    });

	useEffect(() => {
		API("/articles")
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
						<Form className="w-50">
							<Form.Label htmlFor="search" className="w-100 text-center">
								<div className="d-flex align-items-center justify-content-center gap-2">
									<div className="d-table rounded-circle overflow-hidden">
										<Image src="/logo.png" alt="Daily Blog logo" width={50} />
									</div>
									<strong className="fs-1 text-primary">Daily Blog</strong>
								</div>
							</Form.Label>
							<InputGroup className="mb-5">
								<Form.Control
									type="search"
									name="search"
									id="search"
									placeholder="Search article here..."
									className="border-1 border-secondary px-4 py-2"
									value={search}
									onChange={(v) => setSearch(v.value)}
								/>
								<Button variant="outline-secondary" className="border-1">
									<BsSearch size={25} />
								</Button>
							</InputGroup>
						</Form>
					</div>
					<div className="my-5">
						<h2>Top 3 related</h2>
						{!topArticles.length ? (
							<div className="text-center mt-4">
								<Spinner animation="border" variant="primary" />
							</div>
						) : (
							<Row lg={3}>
								{topArticles.map((article) => {
									return (
										<Col key={article.id}>
											<SingleArticle article={article} isRecent={false} />
										</Col>
									);
								})}
							</Row>
						)}
					</div>

					<h2>Recents articles</h2>
					{!topArticles.length ? (
						<div className="text-center mt-4">
							<Spinner animation="border" variant="primary" />
						</div>
					) : (
						<Row lg={3}>
							{topArticles.map((article) => {
								return (
									<Col key={article.id}>
										<SingleArticle article={article} isRecent={true} />
									</Col>
								);
							})}
						</Row>
					)}
				</Container>
			</main>
		</>
	);
}

export default IndexArticle;
