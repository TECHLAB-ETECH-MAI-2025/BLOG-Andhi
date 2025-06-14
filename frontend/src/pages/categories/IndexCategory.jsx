import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, InputGroup, Row, Stack, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { AuthContext } from "../../config/AuthContext";
import { API } from "../../config/Up";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router";

function IndexCategory() {
	const { token } = useContext(AuthContext);
    const navigate = useNavigate();

	const [categories, setCategories] = useState([]);

	const [search, setSearch] = useState("");
	const [searchCategory, setSearchCategory] = useState({
		isSearching: false,
		query: "",
		categories: [],
	});

	const handleInputSearchChange = (e) => {
		const { value } = e.target;

		setSearch(value);

		if (!value.trim()) {
			setSearchCategory({
				isSearching: false,
				query: "",
				categories: [],
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
			setSearchCategory((prevState) => ({
				...prevState,
				isSearching: true,
				query: search,
			}));

			API(token)("/categories/search?s=" + search)
				.then((res) => {
					if (!res.success) {
						console.log(res.message);
						return;
					}
					setSearchCategory({
						isSearching: true,
						query: search,
						categories: res.data.categories,
					});
				})
				.catch((err) => {
					console.error(err.message);
				});
		}
	};

    const handleDelete = (id) => {
        API(token)("/category/" + id + "/delete", {
			method: "DELETE",
		})
			.then((res) => {
				navigate("/category");
			})
			.catch((err) => {
				console.error(err.message);
			});
    }

	useEffect(() => {
		API(token)("/categories")
			.then((res) => {
				if (!res.success) {
					setCategories([]);
					return;
				}
				setCategories(res.data.categories);
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
									placeholder="Search category here..."
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
								<Button className="rounded-pill px-5" onClick={() => navigate("/category/new")}>
									<strong className="fs-4">Add new category</strong>
								</Button>
							</div>
						</Form>
					</div>

					{!categories ? (
						<div className="text-center mt-4">
							<Spinner animation="border" variant="primary" />
						</div>
					) : (
						<Table striped={true} bordered={true} hover={true}>
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Created at</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
                                    searchCategory.isSearching ?
                                    <>
                                        {searchCategory.categories.map((category) => {
                                            return (
                                                <tr key={category.id}>
                                                    <td><Link to={"/category/" + category.id} className="d-block text-decoration-none text-dark">{category.id}</Link></td>
                                                    <td><Link to={"/category/" + category.id} className="d-block text-decoration-none text-dark">{category.name}</Link></td>
                                                    <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <Stack direction="horizontal" gap={2}>
                                                            <Button variant="warning" onClick={() => navigate("/category/edit/" + category.id, { state: category })}>Edit</Button>
                                                            <Button variant="danger" onClick={() => handleDelete(category.id)}>Delete</Button>
                                                        </Stack>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                    :
                                    <>
                                    {categories.map((category) => {
                                        return (
                                            <tr key={category.id}>
                                                <td><Link to={"/category/" + category.id} className="d-block text-decoration-none text-dark">{category.id}</Link></td>
                                                <td><Link to={"/category/" + category.id} className="d-block text-decoration-none text-dark">{category.name}</Link></td>
                                                <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Button variant="warning" onClick={() => navigate("/category/edit/" + category.id, { state: category })}>Edit</Button>
                                                        <Button variant="danger" onClick={() => handleDelete(category.id)}>Delete</Button>
                                                    </Stack>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </>
                                }
							</tbody>
						</Table>
					)}
				</Container>
			</main>
		</>
	);
}

export default IndexCategory;
