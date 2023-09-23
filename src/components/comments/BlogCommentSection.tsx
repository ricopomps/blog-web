"use client";

import { Comment as CommentModel } from "@/models/comment";
import * as CommentApi from "@/network/api/comment";
import { handleError } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import CommentThread from "./CommentThread";
import CreateCommentBox from "./CreateCommentBox";

interface BlogCommentSectionProps {
  blogPostId: string;
}

export default function BlogCommentSection({
  blogPostId,
}: BlogCommentSectionProps) {
  return <CommentSection blogPostId={blogPostId} key={blogPostId} />;
}

function CommentSection({ blogPostId }: BlogCommentSectionProps) {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsLoadingIsError, setCommentsLoadingIsError] = useState(false);

  const [commentsPaginationEnd, setCommentsPaginationEnd] = useState<boolean>();

  const loadNextCommentsPage = useCallback(
    async function (continueAfterId?: string) {
      try {
        setCommentsLoading(true);
        setCommentsLoadingIsError(false);

        const response = await CommentApi.getCommentsForBlogPost(
          blogPostId,
          continueAfterId
        );

        if (!continueAfterId) {
          setComments(response.comments);
        } else {
          setComments((existingComments) => [
            ...existingComments,
            ...response.comments,
          ]);
        }

        setCommentsPaginationEnd(response.endOfPaginationReached);
      } catch (error) {
        handleError(error);
        setCommentsLoadingIsError(true);
      } finally {
        setCommentsLoading(false);
      }
    },
    [blogPostId]
  );

  useEffect(() => {
    loadNextCommentsPage();
  }, [loadNextCommentsPage]);

  function handleCommentCreated(newComment: CommentModel) {
    console.log("gi?", newComment);
    setComments((existingComments) => [newComment, ...existingComments]);
  }

  function handleCommentUpdated(updatedComment: CommentModel) {
    const update = comments.map((exisingComment) =>
      exisingComment._id === updatedComment._id
        ? { ...updatedComment, repliesCount: exisingComment.repliesCount }
        : exisingComment
    );
    setComments(update);
  }

  function handleCommentDeleted(deletedComment: CommentModel) {
    const update = comments.filter(
      (comment) => comment._id !== deletedComment._id
    );
    setComments(update);
  }

  return (
    <div>
      <p className="h5">Comments</p>
      <CreateCommentBox
        blogPostId={blogPostId}
        title={"Write a comment"}
        onCommentCreated={handleCommentCreated}
      />
      {comments.map((comment) => (
        <CommentThread
          comment={comment}
          key={comment._id}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
        />
      ))}
      <div className="mt-2 text-center">
        {commentsPaginationEnd && comments.length === 0 && (
          <p>No one has posted a comment. Be the first!</p>
        )}
        {commentsLoading && <Spinner animation="border" />}
        {commentsLoadingIsError && <p>Comments could not be loaded</p>}
        {!commentsLoading && !commentsPaginationEnd && (
          <Button
            variant="outline-primary"
            onClick={() =>
              loadNextCommentsPage(comments[comments.length - 1]?._id)
            }
          >
            Show more comments
          </Button>
        )}
      </div>
    </div>
  );
}
