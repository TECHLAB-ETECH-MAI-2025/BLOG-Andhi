import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { Button, Container, Spinner, Stack } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { AuthContext } from "../../config/AuthContext";
import Navbar from "../../components/Navbar";
import { API } from "../../config/Up";

function UserItem({ user }) {
	return (
		<Link to={"/chat/" + user.id} className="text-decoration-none">
			<Button
				variant="outline-light"
				className="w-100 d-flex align-items-center gap-4 text-dark"
			>
				<BsPersonCircle size={30} />
				<span className="fs-5">{user.username}</span>
			</Button>
		</Link>
	);
}

function IndexChat() {
	const { token } = useContext(AuthContext);

	const [users, setUsers] = useState([]);

	useEffect(() => {
		API(token)("/users")
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}
				setUsers(res.data.users);
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
						<h1>Chat</h1>
						<p>Select a person you want to chat with</p>
						<Stack gap={2}>
							{!users.length ? (
								<div className="text-center mt-4">
									<Spinner animation="border" variant="primary" />
								</div>
							) : (
								users.map((user) => {
									return <UserItem key={user.id} user={user} />;
								})
							)}
						</Stack>
					</Stack>
				</Container>
			</main>
		</>
	);
}

export default IndexChat;
