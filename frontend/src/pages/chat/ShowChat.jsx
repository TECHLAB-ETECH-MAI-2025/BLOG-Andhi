import { useContext, useEffect } from "react";
import { Container, Spinner, Stack } from "react-bootstrap";
import { AuthContext } from "../../config/AuthContext";
import Navbar from "../../components/Navbar";
import { API } from "../../config/Up";
import { Link, useParams } from "react-router";
import { useState } from "react";

function MessageItem({message, user}) {
  return (
    <Stack>

    </Stack>
  )
}

function ShowChat() {
	const { token, user } = useContext(AuthContext);
	const { id } = useParams();

	const [messages, setMessages] = useState([]);
	const [receiver, setReceiver] = useState({
		id: null,
		username: new String(),
		roles: new Array(),
	});

	useEffect(() => {
		API(token)("/chat/" + id)
			.then((res) => {
				if (!res.success) {
					console.log(res.message);
					return;
				}
				setMessages(res.data.messages);
				setReceiver({
					id: res.data.receiver.id,
					username: res.data.receiver.username,
					roles: res.data.receiver.roles,
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
						<h1>
							Chat with{" "}
							{
                receiver.id ?
                <Link to={"/user/" + receiver.id} className="text-decoration-none">
                  {receiver.username}
                </Link>
                :
                <Spinner animation="grow" variant="primary" />
              }
						</h1>
						<hr />
						<Stack gap={1}>
							{!messages.length ?
								<div className="text-center mt-4">
									<Spinner animation="border" variant="primary" />
								</div>
                :
                messages.map((message, id) => {
                  return (
                    <MessageItem key={id} message={message} user={user} />
                  )
                })
							}
              <span className="text-center">Chat feature is not yet availaible with React</span>
						</Stack>
					</Stack>
				</Container>
			</main>
		</>
	);
}

export default ShowChat;
