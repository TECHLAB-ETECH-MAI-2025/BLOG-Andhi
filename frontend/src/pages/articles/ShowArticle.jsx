import { Badge, Button, Card, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import { Link, useNavigate, useParams } from "react-router";
import { API } from "../../config/Up";
import { useEffect, useState } from "react";
import {
    BsArrowLeftShort,
	BsChatSquareDots,
	BsClockFill,
	BsHeart,
	BsHeartFill,
	BsPencilSquare,
	BsTrash,
} from "react-icons/bs";

function ShowArticle() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [article, setArticle] = useState({
		id: new Number(),
		title: new String(),
		content: new String(),
		created_at: null,
		author: {
			id: new Number(),
			username: new String(),
		},
		categories: new Array({
			id: new Number(),
			name: new String(),
		}),
	});

	const [articleInfoState, setArticleInfoState] = useState({
		like_count: 0,
		comment_count: 0,
	});

	const handleClickLike = () => {};

    const handleDelete = () => {
		if (!article?.id) {
			return;
		}

		API("/article/" + article.id + "/delete", {
			method: "DELETE",
		})
			.then((res) => {
				if (!res.success) {
					return;
				}
				navigate("/article");
			})
			.catch((err) => {
				console.error(err.message);
			});
	};

	useEffect(() => {
		API("/article/" + id)
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}
				setArticle({
					id: res.data.article.id,
					title: res.data.article.title,
					content: res.data.article.content,
					created_at: res.data.article.created_at,
					author: {
						id: res.data.article.author_id,
						username: res.data.article.author_username,
					},
					categories: res.data.article.categories,
				});
			})
			.catch((err) => {
				console.error(err.message);
			});
	}, []);

	return (
		<>
			<Navbar />
			<main>
				<Container className="px-0 py-4">
					<section>
						<Stack>
                            <Stack direction="horizontal">
                                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                                    <BsArrowLeftShort size={30} />
                                </Button>
                            </Stack>
							<Stack
								direction="horizontal"
								className="d-flex align-items-center justify-content-center gap-2 text-muted my-4"
							>
								<BsClockFill />
								<span className="text-muted">
									{article.created_at ? new Date(article.created_at).toLocaleDateString() : null} - by{" "}
									<Link to={"/user/" + article.author.id}>
										{article.author.username}
									</Link>
								</span>
							</Stack>
                            {
                                article.id === parseInt(id) ? 
                                <Stack>
                                    <h1 className="text-center mb-5 pt-1 pb-5">{article.title}</h1>
                                    <p className="fs-5">{article.content}</p>
                                    <Stack direction="horizontal" className="flex-wrap gap-2">
                                        {article.categories.map((category) => {
                                            return (
                                                <Badge key={category.id} className="fs-6 bg-secondary">
                                                    {category.name}
                                                </Badge>
                                            );
                                        })}
                                    </Stack>
                                    <hr />
                                </Stack> :
                                <Spinner variant="primary" size={10} className="mx-auto my-5" />
                            }
							<Row direction="horizontal">
								<Col>
									<Button
										variant="light"
										className="w-100 d-flex align-items-center justify-content-center gap-1"
										onClick={handleClickLike}
									>
										<BsHeart />
										<span>Like ({articleInfoState.like_count})</span>
									</Button>
								</Col>
								<Col>
									<Button
										variant="light"
										className="w-100 d-flex align-items-center justify-content-center gap-1"
									>
										<BsChatSquareDots />
										<span>Comment ({articleInfoState.comment_count})</span>
									</Button>
								</Col>
								<Col>
									<Button
										variant="light"
										className="w-100 d-flex align-items-center justify-content-center gap-1 text-warning"
										onClick={() =>
											navigate("/article/edit/" + article.id, {
												state: article,
											})
										}
									>
										<BsPencilSquare />
										<span>Edit</span>
									</Button>
								</Col>
								<Col>
									<Button
										variant="light"
										className="w-100 d-flex align-items-center justify-content-center gap-1 text-danger"
                                        onClick={handleDelete}
									>
										<BsTrash />
										<span>Delete</span>
									</Button>
								</Col>
							</Row>
						</Stack>
					</section>
					<hr />
					<section>
						<Stack className="my-2">
							<h3>Comment ({articleInfoState.comment_count})</h3>
							<div>
								<div className="border-start border-4 border-primary rounded-2 px-3 py-1 bg-light">
									<div className="d-flex align-items-center justify-content-between gap-2">
										<Stack
											direction="horizontal"
											className="align-items-center gap-2"
										>
											<strong className="fs-5">
												{article.author.username}
											</strong>
											<span>-</span>
											<i className="text-muted">
												{new Date().toLocaleDateString()}
											</i>
										</Stack>
										<Stack direction="horizontal">
											<Button
												variant="light"
												className="d-flex align-items-center justify-content-center gap-1 text-warning"
											>
												<BsPencilSquare />
												<span>Edit</span>
											</Button>
											<Button
												variant="light"
												className="d-flex align-items-center justify-content-center gap-1 text-danger"
											>
												<BsTrash />
												<span>Delete</span>
											</Button>
										</Stack>
									</div>
									<div>
										Lorem ipsum, dolor sit amet consectetur adipisicing elit.
										Nesciunt at quis commodi id, rerum nihil blanditiis optio,
										quasi sapiente possimus a ad dolores, minima voluptatem quas
										repellat. Distinctio, nostrum dolorum!
									</div>
								</div>
							</div>
						</Stack>
					</section>
				</Container>
			</main>
		</>
	);
}

export default ShowArticle;
