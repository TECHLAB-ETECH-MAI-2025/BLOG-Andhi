import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../config/AuthContext";
import { API } from "../../config/Up";
import { Button, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { BsInbox, BsPersonCircle } from "react-icons/bs";
import Navbar from "../../components/Navbar";
import ArticleCard from "../../components/ArticleCard";

function UserProfile() {
	const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

	const { id } = useParams();

	const [userInfo, setUserInfo] = useState({
		id: null,
		username: new String(),
		email: new String(),
		roles: new Array(),
	});

	const [articles, setArticles] = useState(null);

	useEffect(() => {
		if (!id) {
			return;
		}

		API(token)("/user/" + (id ?? user.id))
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
				});                
				API(token)("/article/user/" + id).then((resArticle) => {
					if (!resArticle.success) {
						console.log(resArticle.message);
						return;
					}
					if (!resArticle.data.articles) {
						console.log(resArticle.data.message);
						return;
					}
					setArticles(resArticle.data.articles);
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
					<Stack className="text-center my-4">
						<div className="text-muted mx-auto">
							<BsPersonCircle size={100} />
						</div>
						{ userInfo.id === null ? (
							<div className="text-center mt-4">
								<Spinner animation="border" variant="primary" />
							</div>
						) : (
							<>
								<div className="mx-auto my-3">
									<h1>{userInfo.username}</h1>
									<div>
										<span>{userInfo.email}</span>
									</div>
								</div>
                                <Stack direction="horizontal" gap={2} className="mx-auto">
								{user.id !== userInfo.id ?
                                    <>
                                        <Button variant="success" onClick={() => navigate("/chat/" + userInfo.id)}>Message</Button>
                                    </>
                                    :
                                    <>
                                        <Button variant="info" onClick={() => navigate("/user/edit/" + user.id)}>Edit profile</Button>
                                        <Button variant="primary" onClick={() => navigate("/article/new")}>Create an article</Button>
                                    </>
								}
                                </Stack>
							</>
						)}
					</Stack>
					<Stack>
						{user.id === userInfo.id ? (
							<h2>Your articles</h2>
						) : (
							<h2>Articles posted</h2>
						)}
						{articles === null ? (
							<div className="text-center my-4">
								<Spinner animation="border" variant="primary" />
							</div>
						) : (
							!articles.length ?
                            <Stack className="d-flex align-items-center text-center my-4">
                                <BsInbox size={50} className="text-secondary" />
                                <span className="fs-5">{user.id === userInfo.id ? "You have " : userInfo.username + " has "} never posted any article</span>
                            </Stack>
                            :
                            <Row lg={3}>
								{articles.map((article) => {
									return (
										<Col key={article.id}>
											<ArticleCard article={article} isRecent={true} />
										</Col>
									);
								})}
							</Row>
						)}
					</Stack>
				</Container>
			</main>
		</>
	);
}

export default UserProfile;
