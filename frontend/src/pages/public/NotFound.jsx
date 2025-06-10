import { Alert, Container, Image } from "react-bootstrap";
import { BsDashCircleFill } from "react-icons/bs";
import { Link } from "react-router";

function NotFound() {
	return (
		<>
			<Container className="vh-100 d-flex flex-column align-items-center justify-content-center text-center">
				<div className="mb-3">
					<Link to="/" className="text-decoration-none">
						<div className="d-flex align-items-center justify-content-between gap-2">
							<div className="d-table rounded-circle overflow-hidden">
								<Image src="/logo.png" alt="Daily Blog logo" width={50} />
							</div>
							<strong className="fs-3">Daily Blog</strong>
						</div>
					</Link>
				</div>
				<Alert variant="danger" className="d-flex flex-column align-items-center p-5">
					<BsDashCircleFill size={50} className="text-danger" />
					<span className="fs-1">Feeling lost ?</span>
					<span>
						Go back to <Link to="/">Home page</Link>
					</span>
				</Alert>
			</Container>
		</>
	);
}

export default NotFound;
