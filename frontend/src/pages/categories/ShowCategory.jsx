import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../config/AuthContext";
import { useNavigate, useParams } from "react-router";
import { API } from "../../config/Up";
import Navbar from "../../components/Navbar";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { BsArrowLeftShort, BsClockFill, BsPencilSquare, BsTrash } from "react-icons/bs";

function ShowCategory() {
	const { token, user } = useContext(AuthContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [category, setCategory] = useState({
		id: new Number(),
		name: new String(),
		description: new String(),
		created_at: null,
	});

	const handleDelete = () => {
		if (!category?.id) {
			return;
		}

		API(token)("/category/" + category.id + "/delete", {
			method: "DELETE",
		})
			.then((res) => {
				navigate("/category");
			})
			.catch((err) => {
				console.error(err.message);
			});
	};

	useEffect(() => {
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
	}, []);

	return (
		<>
			<Navbar />
			<main>
				<Container>
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
								Created at {new Date(category.created_at).toLocaleDateString()}
							</span>
						</Stack>
						<div className="text-center">
							<span>Category</span>
							<h1 className="text-center">{category.name}</h1>
						</div>
						<div className="my-2">
							<u className="fs-5">Description</u>
							<p>{category.description}</p>
						</div>
					</Stack>
					{user.roles.includes("ROLE_ADMIN") && (
						<Row direction="horizontal">
							<Col>
								<Button
									variant="light"
									className="w-100 d-flex align-items-center justify-content-center gap-1"
									onClick={() =>
										navigate("/category/edit/" + category.id, {
											state: category,
										})
									}
								>
									<BsPencilSquare size={20} className="text-warning" />
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
						</Row>
					)}
				</Container>
			</main>
		</>
	);
}

export default ShowCategory;
