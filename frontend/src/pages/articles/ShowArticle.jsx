import {
	Badge,
	Button,
	Card,
	Col,
	Container,
	FloatingLabel,
	Form,
	Row,
	Spinner,
	Stack,
} from "react-bootstrap";
import { AuthContext } from "../../config/AuthContext";
import Navbar from "../../components/Navbar";
import { Link, useNavigate, useParams } from "react-router";
import { API } from "../../config/Up";
import { useContext, useEffect, useRef, useState } from "react";
import {
	BsArrowLeftShort,
	BsChatSquareDots,
	BsClockFill,
	BsHeart,
	BsHeartFill,
	BsPencilSquare,
	BsSend,
	BsTrash,
} from "react-icons/bs";
import CommentItem from "../../components/CommentItem";

function ShowArticle() {
	const { token, user } = useContext(AuthContext);
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
		comments: new Array(),
	});

	const [articleInfoState, setArticleInfoState] = useState({
		is_liked: false,
		like_count: 0,
		comment_count: 0,
	});

	const [commentInput, setCommentInput] = useState("");

	const commentInputRef = useRef();

	const handleClickLike = () => {
		API(token)("/article/" + article.id + "/like")
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}
				setArticleInfoState((prevState) => ({
					...prevState,
					is_liked: res.data.liked,
					like_count: res.data.like_count,
				}));
			})
			.catch((err) => {
				console.error(err.message);
			});
	};

	const handleDelete = () => {
		if (!article?.id) {
			return;
		}

		API(token)("/article/" + article.id + "/delete", {
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

	const handleSubmitComment = (e) => {
		e.preventDefault();

		if (!commentInput.trim()) {
			return;
		}

		API(token)("/comment/" + article.id + "/add", {
			method: "POST",
			body: {
				content: commentInput.trim(),
			},
		})
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}

				window.scrollTo({
					top: document.documentElement.scrollHeight,
					behavior: "smooth",
				});

				let newCommentList = article.comments;
				newCommentList.push(res.data.comment);
				setArticle((prevState) => ({
					...prevState,
					comments: newCommentList,
				}));
				
				setArticleInfoState((prevState) => ({
					...prevState,
					comment_count: articleInfoState.comment_count++,
				}));
				
				setCommentInput("");
			})
			.catch((err) => {
				console.error(err.message);
			});
	};

	useEffect(() => {
		API(token)("/article/" + id)
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}
				setArticle((prevState) => ({
					...prevState,
					id: res.data.article.id,
					title: res.data.article.title,
					content: res.data.article.content,
					created_at: res.data.article.created_at,
					author: {
						id: res.data.article.author_id,
						username: res.data.article.author_username,
					},
					categories: res.data.article.categories,
				}));
				setArticleInfoState({
					is_liked: res.data.article.is_liked.includes(user.id),
					like_count: res.data.article.like_count,
					comment_count: res.data.article.comment_count,
				});
			})
			.catch((err) => {
				console.error(err.message);
			});

		API(token)("/comment/" + id)
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}
				setArticle((prevState) => ({
					...prevState,
					comments: res.data.comments,
				}));
			})
			.catch((err) => {
				console.error(err.message);
			});
	}, []);

	useEffect(() => {
		if (article.comments) {
			setArticleInfoState((prevState) => ({
				...prevState,
				comment_count: article.comments.length,
			}));
		}
	}, [article]);

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
								<span>
									{article.created_at
										? new Date(article.created_at).toLocaleDateString()
										: null}{" "}
									- by{" "}
									<Link to={"/user/" + article.author.id}>
										{article.author.username}
									</Link>
								</span>
							</Stack>
							{article.id === parseInt(id) ? (
								<Stack>
									<h1 className="text-center mb-5 pt-1 pb-5">{article.title}</h1>
									<p className="fs-5">{article.content}</p>
									<Stack direction="horizontal" className="flex-wrap gap-2">
										{article.categories.map((category) => {
											return (
												<Link key={category.id} to={"/category/" + category.id}>
													<Badge
														className="fs-6 bg-secondary"
													>
														{category.name}
													</Badge>
												</Link>
											);
										})}
									</Stack>
									<hr />
								</Stack>
							) : (
								<Spinner variant="primary" size={10} className="mx-auto my-5" />
							)}
							<Row>
								<Col>
									<Button
										variant={articleInfoState.is_liked ? "danger" : "light"}
										className="w-100 d-flex align-items-center justify-content-center gap-1"
										onClick={handleClickLike}
									>
										{articleInfoState.is_liked ? (
											<BsHeartFill size={20} />
										) : (
											<BsHeart size={20} className="text-danger" />
										)}
										<span>
											{articleInfoState.is_liked ? "Liked" : "Like"} (
											{articleInfoState.like_count})
										</span>
									</Button>
								</Col>
								<Col>
									<Button
										variant="light"
										className="w-100 d-flex align-items-center justify-content-center gap-1"
										onClick={() => commentInputRef.current.focus()}
									>
										<BsChatSquareDots size={20} className="text-success" />
										<span>Comment ({articleInfoState.comment_count})</span>
									</Button>
								</Col>
								{user.id === article.author.id && (
									<>
										<Col>
											<Button
												variant="light"
												className="w-100 d-flex align-items-center justify-content-center gap-1"
												onClick={() =>
													navigate("/article/edit/" + article.id, {
														state: article,
													})
												}
											>
												<BsPencilSquare
													size={20}
													className="text-warning"
												/>
												<span>Edit</span>
											</Button>
										</Col>
										<Col>
											<Button
												variant="light"
												className="w-100 d-flex align-items-center justify-content-center gap-1"
												onClick={handleDelete}
											>
												<BsTrash size={20} className="text-danger" />
												<span>Delete</span>
											</Button>
										</Col>
									</>
								)}
							</Row>
						</Stack>
					</section>
					<hr />
					<section>
						<Stack className="my-2">
							<Stack>
								<Form
									className="d-flex align-items-start gap-2 my-2"
									onSubmit={handleSubmitComment}
								>
									<Form.Control
										ref={commentInputRef}
										as="textarea"
										name="comment"
										placeholder="Your comment here..."
										className="rounded-4"
										value={commentInput}
										onChange={(e) => setCommentInput(e.target.value)}
										required={true}
									/>
									<Button
										variant="primary"
										type="submit"
										className="rounded-circle d-flex align-items-center"
									>
										<BsSend size={30} className="mt-2" />
									</Button>
								</Form>
								<div>
									<h3>
										Comment{articleInfoState.comment_count > 1 ? "s" : ""} (
										{articleInfoState.comment_count})
									</h3>
								</div>
								<Stack gap={2}>
									{article.comments &&
										article.comments.map((comment, id) => {
											return <CommentItem key={id} comment={comment} />;
										})}
								</Stack>
							</Stack>
						</Stack>
					</section>
				</Container>
			</main>
		</>
	);
}

export default ShowArticle;
