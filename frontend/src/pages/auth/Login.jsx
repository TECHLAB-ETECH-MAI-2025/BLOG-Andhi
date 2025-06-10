import { useState } from "react";
import { BsMoonStarsFill } from "react-icons/bs";
import { Alert, Button, Container, Form, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router";
import { upfetch } from "../../config/Up";

function Login() {
	const { state } = useLocation();

	const [loginForm, setLoginForm] = useState({
		email: state ? state.email :  "",
		password: "",
	});
	const [validForm, setValidForm] = useState({
		isSubmitting: false,
		isValid: false,
		message: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setLoginForm((prevState) => ({
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

		if (loginForm.password.length < 6) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: "Password length error",
			}));
			return;
		}

		upfetch("/api/login", {
			method: "POST",
			body: {
				email: loginForm.email,
				password: loginForm.password,
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
				localStorage.setItem('token', res.token);
			})
			.catch((err) => {
				setValidForm(() => ({
					isSubmitting: true,
					isValid: false,
					message: err.message,
				}));
				console.error(err);
			});
	};

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center">
			<div className="position-relative bg-light d-flex align-items-stretch text-center rounded-5 shadow-lg overflow-hidden">
				<div className="w-50 d-flex align-items-center justify-content-center p-4">
					<div className="w-75 my-5">
						<h2>Sign in</h2>
						<p>Lorem ipsum dolor sit amet consectetur.</p>
						<Form
							method="post"
							className="d-flex flex-column gap-3"
							onSubmit={handleSubmit}
						>
							<Form.Group>
								<Form.Control
									type="email"
									name="email"
									placeholder="Email address"
									className="form-control rounded-pill"
									value={loginForm.email}
									onChange={handleInputChange}
									required={true}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Control
									type="password"
									name="password"
									placeholder="Your password"
									className="form-control rounded-pill"
									value={loginForm.password}
									onChange={handleInputChange}
									required={true}
								/>
							</Form.Group>
							{validForm.isSubmitting && !validForm.isValid && (
								<Alert variant="danger">{validForm.message}</Alert>
							)}
							<Button variant="primary" type="submit" className="rounded-pill mx-5">
								Connect
							</Button>
						</Form>
					</div>
				</div>
				<div className="w-50 bg-primary d-flex flex-column align-items-center justify-content-around gap-3 text-light py-5">
					<Link to="/" className="text-light text-decoration-none">
						<div className="d-flex align-items-center justify-content-between gap-2">
							<div className="d-table rounded-circle overflow-hidden">
								<Image src="/logo.png" alt="Daily Blog logo" width={50} />
							</div>
							<span className="fs-1">
								<strong>Daily Blog</strong>
							</span>
						</div>
					</Link>
					<div className="w-75">
						<h5 className="my-4">Don't have an account ?</h5>
						<p>Sign up with your personal informations to enjoy all article</p>
						<Link to="/register">
							<Button variant="outline-light" className="rounded-pill px-3">
								<span>Create new account</span>
							</Button>
						</Link>
					</div>
				</div>
				<div className="position-absolute top-0 start-0 end-0 mt-3">
					<Button variant="light">
						<BsMoonStarsFill />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Login;
