import { useContext, useEffect } from "react";
import {
	Container,
	Navbar as BsNavbar,
	Image,
	Button,
	NavbarToggle,
	NavItem,
	Nav,
	NavbarBrand,
} from "react-bootstrap";
import { Link } from "react-router";
import { AuthContext } from "../config/AuthContext";
import { BsBoxArrowInRight, BsBoxArrowRight, BsPersonCircle } from "react-icons/bs";

function Navbar() {
	let { user, logout } = useContext(AuthContext);
	
	return (
		<header>
			<BsNavbar className="w-100 position-fixed top-0 navbar-expand-lg navbar-light bg-white shadow-sm" style={{ zIndex: 99}}>
				<Container className="d-flex align-items-center justify-content-between px-0">
					<NavbarBrand className="d-flex gap-4 py-1">
						<Link to="/" className="text-decoration-none">
							<div className="d-flex align-items-center justify-content-between gap-2">
								<div className="d-table rounded-circle overflow-hidden">
									<Image src="/logo.png" alt="Daily Blog logo" width={50} />
								</div>
								<strong className="fs-3">Daily Blog</strong>
							</div>
						</Link>
					</NavbarBrand>
					<div>
						<NavbarToggle
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</NavbarToggle>
						<Nav className="collapse navbar-collapse" id="navbarSupportedContent">
							<ul className="navbar-nav align-items-center gap-2">
								{
									user ?
									<>
										<NavItem>
											<Link to={"/article"} className="nav-link">
												Articles
											</Link>
										</NavItem>
										{
											user.roles && (
												user.roles.includes("ROLE_ADMIN") &&
												<NavItem>
													<Link to={"/category 	"} className="nav-link">
														Categories
													</Link>
												</NavItem>
											)
										}
									</>
									:
									<>
										<NavItem>
											<Link to={"/contact"} className="nav-link">
												Contact
											</Link>
										</NavItem>
										<NavItem>
											<Link to={"/about"} className="nav-link">
												About
											</Link>
										</NavItem>
									</>
								}
								{
									user &&
									<NavItem>
										<Button
											variant="outline"
											className="d-flex align-items-center gap-2 rounded-pill"
											onClick={() => logout()}
											>
											<BsBoxArrowRight /> <span>Logout</span>
										</Button>
									</NavItem>
								}
								<NavItem>
									<Link to={user ? "/user/" + user.id : "/login"} className="nav-link">
										<Button variant="primary" className="d-flex align-items-center gap-2 rounded-pill px-3">
											{
												user ?
												<>
													<BsPersonCircle /> <strong>{user.username}</strong>
												</>
												:
												<>
													<BsBoxArrowInRight /> <strong>Sign in</strong>
												</>
											}
										</Button>
									</Link>
								</NavItem>
							</ul>
						</Nav>
					</div>
				</Container>
			</BsNavbar>
		</header>
	);
}

export default Navbar;
