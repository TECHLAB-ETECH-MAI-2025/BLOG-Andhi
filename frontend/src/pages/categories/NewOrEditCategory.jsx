import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Alert, Button, Col, Container, FloatingLabel, Form, Row, Stack } from "react-bootstrap";
import {
	BsArrowCounterclockwise,
	BsArrowLeftShort,
	BsBoxArrowInUp,
	BsCheck2Circle,
    BsTrash,
} from "react-icons/bs";
import { AuthContext } from "../../config/AuthContext";
import Navbar from "../../components/Navbar";
import { API } from "../../config/Up";

const NEW_CATEGORY = "NEW_CATEGORY";
const EDIT_CATEGORY = "EDIT_CATEGORY";

function NewOrEditCategory({ newOrEdit }) {
	const { token } = useContext(AuthContext);
	const { id } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();

	const [category, setCategory] = useState({
		id: state ? state.id : 0,
		name: state ? state.name : "",
		description: state ? state.description : "",
		created_at: state ? state.created_at : new Date(),
		article_count: state ? state.article_count : 0,
	});

	const [validForm, setValidForm] = useState({
		isSubmitting: false,
		isValid: false,
		message: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setCategory((prevState) => ({
			...prevState,
			[name]: value,
		}));

		setValidForm((prevState) => ({
			...prevState,
			isSubmitting: false,
		}));
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

		if (!category.name.trim().length) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: 'Input "name" length error',
			}));
			return;
		}

		if (!category.description.trim().length) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: 'Input "description" length error',
			}));
			return;
		}

		let APICall = {
			url: new String(),
			method: new String(),
		};

		switch (newOrEdit) {
			case NEW_CATEGORY:
				APICall.url = "/category/create";
				APICall.method = "POST";
				break;
			case EDIT_CATEGORY:
				APICall.url = "/category/" + category.id + "/edit";
				APICall.method = "PUT";
				break;
			default:
				return;
		}

		API(token)(APICall.url, {
			method: APICall.method,
			body: {
				name: category?.name.trim(),
				description: category?.description.trim(),
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
					setCategory({
						id: res.data.category.id,
						name: res.data.category.name,
						description: res.data.category.description,
						created_at: res.data.category.created_at,
					});
				}
				navigate("/category");
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
		if (!category?.id) {
			return;
		}
		setValidForm((prevState) => ({
			...prevState,
			isSubmitting: true,
			isValid: true,
		}));

		API(token)("/category/" + category.id + "/delete", {
			method: "DELETE",
		})
			.then((res) => {
				setValidForm((prevState) => ({
					...prevState,
					isValid: false,
					message: res.message,
				}));
				navigate("/category");
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
		if (!state && newOrEdit === EDIT_CATEGORY) {
			API(token)("/category/" + id)
				.then((res) => {
					if (!res.success) {
						console.log(res.message);
						return;
					}
					setCategory({
						id: res.data.category.id,
						name: res.data.category.name,
						description: res.data.category.description,
						created_at: res.data.category.created_at,
					});
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
				<Container>
					<Stack direction="horizontal" className="align-items-start gap-3">
						<Button variant="outline-secondary" onClick={() => navigate(-1)}>
							<BsArrowLeftShort size={30} />
						</Button>
						<h1>{newOrEdit === NEW_CATEGORY ? "Create a new" : "Edit"} category</h1>
					</Stack>
					<Form className="d-flex flex-column gap-2 my-2" onSubmit={handleSubmit}>
						<hr />
						<FloatingLabel label="Name">
							<Form.Control
								type="text"
								name="name"
								placeholder="Enter the name"
								className="rounded-4"
								value={category.name}
								onChange={handleInputChange}
								required={true}
							/>
						</FloatingLabel>
						<FloatingLabel label="Description">
							<Form.Control
								as="textarea"
								name="description"
								placeholder="Enter the description of category"
								className="rounded-4"
								value={category.description}
								onChange={handleInputChange}
								required={true}
								style={{ height: "50vh" }}
							/>
						</FloatingLabel>
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
									{newOrEdit === NEW_CATEGORY ? (
										<BsBoxArrowInUp />
									) : (
										<BsCheck2Circle />
									)}
									<span>{newOrEdit === NEW_CATEGORY ? "Create" : "Update"}</span>
								</Button>
							</Col>
							{newOrEdit === NEW_CATEGORY && (
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
							{newOrEdit === EDIT_CATEGORY && (
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
				</Container>
			</main>
		</>
	);
}

export default NewOrEditCategory;
