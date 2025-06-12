import { Alert, Button, Col, Container, FloatingLabel, Form, Row, Stack } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import {
	BsArrowCounterclockwise,
	BsArrowLeftShort,
	BsBoxArrowInUp,
	BsCheck,
	BsCheck2Circle,
	BsClockFill,
	BsTrash,
} from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { API } from "../../config/Up";
import { AuthContext } from "../../config/AuthContext";

const NEW_ARTICLE = "NEW_ARTICLE";
const EDIT_ARTICLE = "EDIT_ARTICLE";

function NewOrEditArticle({ newOrEdit = NEW_ARTICLE }) {
	const { token } = useContext(AuthContext);
	const { id } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();

	const [article, setArticle] = useState({
		id: state ? state.id : 0,
		title: state ? state.title : "",
		content: state ? state.content : "",
		created_at: state ? state.created_at : new Date(),
		author: {
			id: state ? state.author.id : 0,
			username: state ? state.author.username : "",
		},
		categories: state ? state.categories : [],
	});

	const [selectedCategory, setSelectedCategory] = useState(article.categories?.map((v) => v.id));
	const [listCategory, setListCategory] = useState([]);

	const [validForm, setValidForm] = useState({
		isSubmitting: false,
		isValid: false,
		message: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setArticle((prevState) => ({
			...prevState,
			[name]: value,
		}));

		setValidForm((prevState) => ({
			...prevState,
			isSubmitting: false,
		}));
	};

	const handleSelectCategories = (e) => {
		const values = Array.from(e.target.selectedOptions, (o) => parseInt(o.value));
		setSelectedCategory(values);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		if (!form.checkValidity()) {
			e.stopPropagation();
		}

		setValidForm((prevState) => ({
			...prevState,
			isSubmitting: true,
			isValid: true,
		}));

		if (!article.title.trim().length) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: 'Input "title" length error',
			}));
			return;
		}

		if (!article.content.trim().length) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: 'Input "content" length error',
			}));
			return;
		}

		if (!selectedCategory) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: 'Input "categories" length error',
			}));
			return;
		}

		let APICall = {
			url: new String(),
			method: new String(),
		};

		switch (newOrEdit) {
			case NEW_ARTICLE:
				APICall.url = "/article/create";
				APICall.method = "POST";
				break;
			case EDIT_ARTICLE:
				APICall.url = "/article/" + article.id + "/edit";
				APICall.method = "PUT";
				break;
			default:
				return;
		}

		API(token)(APICall.url, {
			method: APICall.method,
			body: {
				title: article?.title.trim(),
				content: article?.content.trim(),
				categories: selectedCategory,
			},
		})
			.then((res) => {
				if (!res.success) {
					setValidForm(() => ({
						isSubmitting: true,
						isValid: false,
						message: res.message,
					}));
					return;
				}
				setValidForm((prevState) => ({
					...prevState,
					isValid: false,
					message: res.message,
				}));
				if (res.data) {
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
				}
			})
			.catch((err) => {
				setValidForm(() => ({
					isSubmitting: true,
					isValid: false,
					message: err.message,
				}));
				console.error(err.message);
			});
	};

	const handleDelete = () => {
		if (!article?.id) {
			return;
		}
		setValidForm((prevState) => ({
			...prevState,
			isSubmitting: true,
			isValid: true,
		}));

		API(token)("/article/" + article.id + "/delete", {
			method: "DELETE",
		})
			.then((res) => {
				if (!res.success) {
					setValidForm((prevState) => ({
						...prevState,
						isValid: false,
						message: res.message,
					}));
					return;
				}
				setValidForm((prevState) => ({
					...prevState,
					isValid: false,
					message: res.message,
				}));
				navigate("/article");
			})
			.catch((err) => {
				setValidForm(() => ({
					isSubmitting: true,
					isValid: false,
					message: err.message,
				}));
				console.error(err.message);
			});
	};

	useEffect(() => {
		if (!state && newOrEdit === EDIT_ARTICLE) {
			API(token)("/article/" + id)
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
					setSelectedCategory(article.categories.map((v) => v.id));
				})
				.catch((err) => {
					console.error(err.message);
				});
		}
		if (!listCategory.length) {
			API(token)("/categories")
				.then((res) => {
					if (!res.success) {
						console.log(res.message);
						return;
					}
					setListCategory(res.data.categories);
				})
				.catch((err) => {
					console.error(err.message);
				});
		}
	}, []);

	return (
		<>
			<Navbar />
			<main>
				<Container className="px-0 py-4">
					<Stack direction="horizontal" className="align-items-start gap-3">
						<Button variant="outline-secondary" onClick={() => navigate(-1)}>
							<BsArrowLeftShort size={30} />
						</Button>
						<h1>{newOrEdit === NEW_ARTICLE ? "New" : "Edit"} article</h1>
					</Stack>
					<Stack direction="horizontal" className="align-items-start gap-5">
						<Form
							className="w-50 position-sticky top-0 d-flex flex-column gap-2 my-2"
							onSubmit={handleSubmit}
						>
							<h2>Edition section</h2>
							<hr />
							<FloatingLabel label="Title">
								<Form.Control
									type="text"
									name="title"
									placeholder="Enter the title"
									className="rounded-4"
									value={article.title}
									onChange={handleInputChange}
									required={true}
								/>
							</FloatingLabel>
							<FloatingLabel label="Content">
								<Form.Control
									as="textarea"
									name="content"
									placeholder="The content here"
									className="rounded-4"
									value={article.content}
									onChange={handleInputChange}
									required={true}
									style={{ height: "50vh" }}
								/>
							</FloatingLabel>
							<Form.Select
								multiple={true}
								name="categories"
								value={selectedCategory}
								onChange={handleSelectCategories}
							>
								<option>Select any category</option>
								{listCategory &&
									listCategory.map((category) => {
										return (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										);
									})}
							</Form.Select>
							{validForm.isSubmitting && !validForm.isValid && (
								<Alert variant="danger">{validForm.message}</Alert>
							)}
							<Row direction="horizontal">
								<Col>
									<Button
										type="submit"
										variant="light"
										className="w-100 d-flex align-items-center justify-content-center gap-1 text-primary"
									>
										{newOrEdit === NEW_ARTICLE ? (
											<BsBoxArrowInUp />
										) : (
											<BsCheck2Circle />
										)}
										<span>
											{newOrEdit === NEW_ARTICLE ? "Create" : "Update"}
										</span>
									</Button>
								</Col>
								{newOrEdit === NEW_ARTICLE && (
									<Col>
										<Button
											variant="light"
											className="w-100 d-flex align-items-center justify-content-center gap-1 text-danger"
											onClick={() => navigate(-1)}
										>
											<BsArrowCounterclockwise />
											<span>Cancel</span>
										</Button>
									</Col>
								)}
								{newOrEdit === EDIT_ARTICLE && (
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
								)}
							</Row>
						</Form>

						<Stack className="w-50 my-2">
							<div className="position-sticky top-0 bg-white">
								<h2 className="w-100 pb-3">Preview section</h2>
								<hr />
							</div>
							{newOrEdit === EDIT_ARTICLE && (
								<Stack
									direction="horizontal"
									className="d-flex align-items-center justify-content-center gap-2 text-muted my-4"
								>
									<BsClockFill />
									<span className="text-muted">
										{new Date(article.created_at).toLocaleDateString()} - by{" "}
										<Link to={"/user/" + article.author.id}>
											{article.author.username}
										</Link>
									</span>
								</Stack>
							)}
							<Stack className="overflow-x-auto">
								<h1 className="text-center mb-5 pt-1 pb-2">{article.title}</h1>
								<p className="fs-5">{article.content}</p>
							</Stack>
						</Stack>
					</Stack>
				</Container>
			</main>
		</>
	);
}

export default NewOrEditArticle;
