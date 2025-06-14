import { Button, Stack } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function CommentItem({comment}) {

	return (
		<div className="border-start border-4 border-primary rounded-2 px-3 py-1 bg-light">
			<div className="d-flex align-items-center justify-content-between gap-2">
				<Stack direction="horizontal" className="align-items-center gap-2">
					<strong className="fs-5">{comment.author_username}</strong>
					<span>-</span>
					<i className="text-muted">{new Date().toLocaleDateString()}</i>
				</Stack>
				<Stack direction="horizontal">
					<Button
						variant="light"
						className="d-flex align-items-center justify-content-center gap-1 text-warning"
					>
						<BsPencilSquare />
						<span>Edit</span>
					</Button>
					<Button
						variant="light"
						className="d-flex align-items-center justify-content-center gap-1 text-danger"
					>
						<BsTrash />
						<span>Delete</span>
					</Button>
				</Stack>
			</div>
			<div>
				{
                    comment.content
                }
			</div>
		</div>
	);
}

export default CommentItem;
