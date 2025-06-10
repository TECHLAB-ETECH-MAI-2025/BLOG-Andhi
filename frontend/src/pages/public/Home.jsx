import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import { BsChatSquareDotsFill, BsClockFill, BsHeartFill } from "react-icons/bs";
import { Link } from "react-router";

function Home() {
	return (
		<>
				<Navbar />
			<main>
				<div className="vh-100 d-flex align-items-center">
					<Container className="h-100 d-flex flex-column">
						<div className="flex-grow-1 d-flex align-items-center gap-5 mt-5 pt-5">
							<div className="w-75 d-flex flex-column gap-2 py-5">
								<span>
									<strong>
										<span className="fs-4">Daily room,</span>
										<br />
										<span className="fs-1 text-primary">Daily Blog</span>
									</strong>
								</span>
								<p className="mb-0">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Consequuntur deleniti ipsa, officiis pariatur, eius at mollitia
									fuga veniam, non esse voluptas eveniet enim numquam doloribus!
								</p>
								<Link to="/register" className="mt-1">
									<Button variant="primary" className="rounded-pill px-3">
										Get started
									</Button>
								</Link>
							</div>
							<div className="w-50 d-flex flex-column gap-2 py-5">
								<div className="bg-primary text-light rounded-5 p-5">
									<strong className="fs-2">Hello, world</strong>
									<hr />
									<p>
										Lorem ipsum dolor sit amet consectetur adipisicing elit.
										Sint sequi aliquam sed facere, atque iure ipsam illum minus
										suscipit ipsa dolore similique? Beatae totam vitae alias
										expedita ipsam voluptate fugit.
									</p>
									<Row>
										<Col className="d-flex align-items-center gap-2">
											<BsClockFill /> <span>{ new Date().getHours().toString() }h ago</span>
										</Col>
										<Col className="d-flex align-items-center justify-content-end gap-4">
											<div className="align-items-center gap-1">
												<BsHeartFill /> <span>4</span>
											</div>
											<div className="align-items-center gap-1">
												<BsChatSquareDotsFill /> <span>4</span>
											</div>
										</Col>
									</Row>
								</div>
							</div>
						</div>
						<div className="d-flex justify-content-center gap-2 mb-4">
							<Card className="w-25 text-center p-2">
								<Card.Title className="text-muted">Member</Card.Title>
								<Card.Body className="p-0">
									<h3>10</h3>
								</Card.Body>
							</Card>
							<Card className="w-25 text-center p-2">
								<Card.Title className="text-muted">Article posted</Card.Title>
								<Card.Body className="p-0">
									<h3>3</h3>
								</Card.Body>
							</Card>
						</div>
					</Container>
				</div>
			</main>
			<footer>
				<Container className="text-muted text-center">
					<hr />
					<div className="pt-2 pb-4">
						&copy; {new Date().getFullYear().toString() } - Daily Blog by <Link to="https://github.com/andhi-kenah">Andhi Kenah</Link> from TechLab Etech 2025
					</div>
				</Container>
			</footer>
		</>
	);
}

export default Home;
