import { Link } from "react-router";
import { Badge, Card, Col, Row, Stack } from "react-bootstrap";
import { BsChatSquareDotsFill, BsClockFill, BsHeartFill } from "react-icons/bs";

function ArticleCard({ article, isRecent = true }) {
    return (
        <Card className="rounded-4 overflow-hidden">
            <Card.Body className="p-4">
                {isRecent && (
                    <Stack direction="horizontal" className="d-flex align-items-center gap-2 text-muted mb-2">
                        <BsClockFill /> <span>{new Date().getHours().toString()}h ago</span>
                    </Stack>
                )}
                <Card.Title className="fs-3 text-primary">
                    <Link to={"/article/" + article.id} className="text-decoration-none">{article.title.length > 27 ? article.title.slice(0, 27) + "..." : article.title}</Link>
                </Card.Title>
                <Card.Text>{article.content.length > 47 ? article.content.slice(0, 47) + "..." : article.content}</Card.Text>
                {
                    article.categories.length > 0 &&
                    <Row>
                        {
                            article.categories.map(category => {
                                return (
                                    <Col key={category.id}>
                                        <Badge bg="secondary">{category.name}</Badge>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                }
            </Card.Body>
            <Card.Footer className="bg-white text-muted px-4">
                <Row>
                    <Col className="d-flex align-items-center justify-content-end gap-4">
                        <div className="align-items-center gap-1">
                            <BsHeartFill /> <span>4</span>
                        </div>
                        <div className="align-items-center gap-1">
                            <BsChatSquareDotsFill /> <span>4</span>
                        </div>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}

export default ArticleCard;