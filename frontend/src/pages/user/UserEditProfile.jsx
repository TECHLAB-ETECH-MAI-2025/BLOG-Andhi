import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Form, Col, Container, FloatingLabel, Row, Spinner, Stack } from "react-bootstrap";
import { BsArrowCounterclockwise, BsCheck, BsPersonCircle } from "react-icons/bs";
import { API } from "../../config/Up";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../config/AuthContext";

function UserEditProfile() {
	const { token, setUser } = useContext(AuthContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [userInfo, setUserInfo] = useState({
		id: null,
		username: new String(),
		email: new String(),
		roles: new Array(),
		created_at: new Date(),
	});

    const [usernameInput, setUsernameInput] = useState("");

    const handleSubmit = () => {
        if (!usernameInput.trim()) {
            return;
        }

        API(token)("/user/" + userInfo.id + "/edit", {
            method: "PUT",
            body: {
                username: usernameInput.trim()
            }
        })
            .then(res => {
                if (!res.success) {
                    console.log(res.message);
                    return;
                }
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
                navigate("/user/" + userInfo.id);
            })
            .catch(err => {
                console.error(err.message);
            });
    }

	useEffect(() => {
		API(token)("/user/" + id)
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}
				setUserInfo({
					id: res.data.user.id,
					username: res.data.user.username,
					email: res.data.user.email,
					roles: res.data.user.roles,
					created_at: res.data.user.created_at,
				});
                setUsernameInput(res.data.user.username);
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
					<Stack className="text-center my-4">
						<div className="text-muted mx-auto">
							<BsPersonCircle size={100} />
						</div>
						{userInfo.id === null ? (
							<div className="text-center mt-4">
								<Spinner animation="border" variant="primary" />
							</div>
						) : (
							<>
								<div className="my-3">
									<span>{userInfo.email}</span>
                                    <FloatingLabel label="Username" className="w-100 mt-2 mb-1">
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            className="rounded-4"
                                            value={usernameInput}
                                            onChange={(e) => setUsernameInput(e.target.value)}
                                            required={true}
                                        />
                                    </FloatingLabel>
								</div>
								<Row>
									<Col>
										<Button
											variant="light"
											className="w-100 d-flex align-items-center justify-content-center gap-1 text-danger"
											onClick={handleSubmit}
										>
											<BsCheck />
											<span>Save</span>
										</Button>
									</Col>
									<Col>
										<Button
											variant="light"
											className="w-100 d-flex align-items-center justify-content-center gap-1 text-secondary"
											onClick={() => navigate(-1)}
										>
											<BsArrowCounterclockwise />
											<span>Cancel</span>
										</Button>
									</Col>
								</Row>
							</>
						)}
					</Stack>
				</Container>
			</main>
		</>
	);
}

export default UserEditProfile;
