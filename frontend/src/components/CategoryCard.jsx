import { Link } from "react-router";
import { Badge, Card, Col, Row, Stack } from "react-bootstrap";
import { BsChatSquareDotsFill, BsClockFill, BsFileText, BsHeartFill } from "react-icons/bs";

function CategoryCard({ article, isRecent = true }) {
    return (
        <Card className="rounded-4 overflow-hidden">
            <Card.Body className="p-4">
                <Card.Title className="fs-3 text-primary">
                    <Link to={"/article/" + article.id} className="text-decoration-none">{article.title.length > 27 ? article.title.slice(0, 27) + "..." : article.title}</Link>
                </Card.Title>
            </Card.Body>
            <Card.Footer className="bg-white text-muted px-4">
                <Row>
                    <Col className="d-flex align-items-center justify-content-end gap-4">
                        <div className="align-items-center gap-1">
                            <BsFileText /> <span>{category.article_count}</span>
                        </div>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}

export default CategoryCard;