import { useState } from "react";
import { Alert, Button, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { upfetch } from "../../config/Up";

function Register() {
	let navigate = useNavigate();

	const [registerForm, setRegisterForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeTerms: false,
	});

	const [validForm, setValidForm] = useState({
		isSubmitting: false,
		isValid: false,
		message: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setRegisterForm((prevState) => ({
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

		if (registerForm.password.length < 6) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: "Minimum password length is 6",
			}));
			return;
		}

		if (registerForm.password !== registerForm.confirmPassword) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: "Confirmation password is not match",
			}));
			return;
		}

		if (!registerForm.agreeTerms) {
			setValidForm((prevState) => ({
				...prevState,
				isValid: false,
				message: "Terms not agree",
			}));
			return;
		}

		upfetch("/api/register", {
			method: "POST",
			body: {
				username: registerForm.username,
				email: registerForm.email,
				password: registerForm.password,
				confirmPassword: registerForm.confirmPassword,
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
				navigate("/login", { state: { email: res.data.user.email } });
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
			<div className="bg-light d-flex align-items-stretch text-center rounded-5 shadow-lg overflow-hidden">
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
						<div className="my-2">
							<span>Already have an account ?</span>
						</div>
						<Link to="/login">
							<Button variant="outline-light" className="rounded-pill px-3">
								<span>Login now</span>
							</Button>
						</Link>
					</div>
				</div>
				<div className="w-50 d-flex align-items-center justify-content-center p-4">
					<div className="w-100 my-5 mx-5">
						<h2>Sign up</h2>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit,
							deserunt.
						</p>
						<Form
							method="post"
							name="login"
							className="d-flex flex-column gap-3"
							onSubmit={handleSubmit}
						>
							<Form.Group>
								<Form.Control
									type="text"
									name="username"
									placeholder="Enter your name"
									className="form-control rounded-pill"
									value={registerForm.username}
									onChange={handleInputChange}
									required={true}
								/>
							</Form.Group>
							<Form.Control
								type="email"
								name="email"
								placeholder="Email address"
								className="form-control rounded-pill"
								value={registerForm.email}
								onChange={handleInputChange}
								required={true}
							/>
							<Form.Control
								type="password"
								name="password"
								placeholder="Your password"
								className="form-control rounded-pill"
								value={registerForm.password}
								onChange={handleInputChange}
								required={true}
							/>
							<Form.Control
								type="password"
								name="confirmPassword"
								placeholder="Confirm your password"
								className="form-control rounded-pill"
								value={registerForm.confirmPassword}
								onChange={handleInputChange}
								required={true}
							/>
							<Form.Check
								type="checkbox"
								name="agreeTerms"
								label="Agree terms"
								className="text-start mx-auto"
								id="default-checkbox"
								value={registerForm.agreeTerms}
								onChange={handleInputChange}
							/>
							{validForm.isSubmitting && !validForm.isValid && (
								<Alert variant="danger" className="py-1 mx-2">
									{validForm.message}
								</Alert>
							)}
							<Button variant="primary" type="submit" className="rounded-pill mx-5">
								Create account
							</Button>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
