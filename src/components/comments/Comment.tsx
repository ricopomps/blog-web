import { AuthModalsContext } from "@/app/AuthModalsProvider";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { Comment as CommentModel } from "@/models/comment";
import * as CommentApi from "@/network/api/comment";
import { NotFoundError } from "@/network/http-errors";
import { formatRelativeDate, handleError } from "@/utils/utils";
import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import UserProfileLink from "../UserProfileLink";
import CreateCommentBox from "./CreateCommentBox";
import EditCommentBox from "./EditCommentBox";

interface CommentProps {
  comment: CommentModel;
  onReplyCreated: (reply: CommentModel) => void;
  onCommentUpdated: (updatedComment: CommentModel) => void;
  onCommentDeleted: (createdComment: CommentModel) => void;
}

export default function Comment({
  comment,
  onReplyCreated,
  onCommentUpdated,
  onCommentDeleted,
}: CommentProps) {
  const { user } = useAuthenticatedUser();
  const authModalsContext = useContext(AuthModalsContext);

  const [showEditBox, setShowEditBox] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  function handleCommentUpdated(updatedComment: CommentModel) {
    onCommentUpdated(updatedComment);
    setShowEditBox(false);
  }

  function handleReplyClick() {
    if (user) {
      setShowReplyBox(true);
    } else {
      authModalsContext.showLoginModal();
    }
  }

  function handleEditClick() {
    setShowEditBox(true);
    setShowDeleteConfirmation(false);
  }

  function handleReplyCreated(newReply: CommentModel) {
    onReplyCreated(newReply);
    setShowReplyBox(false);
  }

  return (
    <div>
      <hr />

      {showEditBox ? (
        <EditCommentBox
          comment={comment}
          onCommentUpdated={handleCommentUpdated}
          onCancel={() => setShowEditBox(false)}
        />
      ) : (
        <CommentLayout
          comment={comment}
          onReplyClicked={handleReplyClick}
          onEditClicked={handleEditClick}
          onDeleteCliked={() => setShowDeleteConfirmation(true)}
        />
      )}
      {showReplyBox && (
        <CreateCommentBox
          blogPostId={comment.blogPostId}
          title="Write a reply"
          onCommentCreated={handleReplyCreated}
          parentCommentId={comment.parentCommentId ?? comment._id}
          showCancel
          onCancel={() => setShowReplyBox(false)}
          defaultText={
            comment.parentCommentId ? `@${comment.author.username} ` : ""
          }
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          comment={comment}
          onCommentDeleted={onCommentDeleted}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
}

interface CommentLayoutProps {
  comment: CommentModel;
  onReplyClicked: () => void;
  onEditClicked: () => void;
  onDeleteCliked: () => void;
}

function CommentLayout({
  comment: { text, author, createdAt, updatedAt },
  onReplyClicked,
  onEditClicked,
  onDeleteCliked,
}: CommentLayoutProps) {
  const { user } = useAuthenticatedUser();

  const loggedInUserIsAuthor = (user && user._id === author._id) || false;

  return (
    <div>
      <div className="mb-2">{text}</div>
      <div className="d-flex gap-2 align-items-center">
        <UserProfileLink user={author} />
        {formatRelativeDate(createdAt)}
        {updatedAt > createdAt && <span>(Edited)</span>}
      </div>
      <div className="mt-1 d-flex gap-2">
        <Button variant="link" className="small" onClick={onReplyClicked}>
          Reply
        </Button>
        {loggedInUserIsAuthor && (
          <>
            <Button variant="link" className="small" onClick={onEditClicked}>
              Edit
            </Button>
            <Button
              variant="link text-danger"
              className="small"
              onClick={onDeleteCliked}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
interface DeleteConfirmationProps {
  comment: CommentModel;
  onCommentDeleted: (comment: CommentModel) => void;
  onCancel: () => void;
}
function DeleteConfirmation({
  comment,
  onCommentDeleted,
  onCancel,
}: DeleteConfirmationProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  async function deleteComment() {
    try {
      setDeleteInProgress(true);
      await CommentApi.deleteComment(comment._id);
      onCommentDeleted(comment);
    } catch (error) {
      if (error instanceof NotFoundError) {
        onCommentDeleted(comment);
      } else {
        handleError(error);
      }
    } finally {
      setDeleteInProgress(false);
    }
  }
  return (
    <div>
      <p className="text-danger">Do you really want to delete this comment?</p>
      <Button
        variant="danger"
        onClick={deleteComment}
        disabled={deleteInProgress}
      >
        Delete
      </Button>
      <Button
        className="ms-2"
        variant="outline-danger"
        onClick={onCancel}
        disabled={deleteInProgress}
      >
        Cancel
      </Button>
    </div>
  );
}
