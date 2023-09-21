import { Comment as CommentModel } from "@/models/comment";
import { formatRelativeDate } from "@/utils/utils";
import UserProfileLink from "../UserProfileLink";

interface CommentProps {
  comment: CommentModel;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div>
      <hr />
      <CommentLayout comment={comment} />
    </div>
  );
}

interface CommentLayoutProps {
  comment: CommentModel;
}

function CommentLayout({
  comment: { text, author, createdAt, updatedAt },
}: CommentLayoutProps) {
  return (
    <div>
      <div className="mb-2">{text}</div>
      <div className="d-flex gap-2 align-items-center">
        <UserProfileLink user={author} />
        {formatRelativeDate(createdAt)}
        {updatedAt > createdAt && <span>(Edited)</span>}
      </div>
    </div>
  );
}
