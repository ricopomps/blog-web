import { Comment, CommentsPage } from "@/models/comment";
import api from "@/network/axiosInstance";

const baseUrl = "/comments";

export async function getCommentsForBlogPost(
  blogPostId: string,
  continueAfterId?: string
) {
  const response = await api.get<CommentsPage>(
    `${baseUrl}/blog/${blogPostId}`,
    {
      params: {
        continueAfterId,
      },
    }
  );
  return response.data;
}

export async function createComment(
  blogPostId: string,
  parentCommentId: string | undefined,
  text: string
) {
  const response = await api.post<Comment>(`${baseUrl}/blog/${blogPostId}`, {
    text,
    parentCommentId,
  });
  return response.data;
}

export async function getRepliesForComment(
  commentId: string,
  continueAfterId?: string
) {
  const response = await api.get<CommentsPage>(
    `${baseUrl}/${commentId}/replies`,
    {
      params: {
        continueAfterId,
      },
    }
  );
  return response.data;
}

export async function updateComment(commentId: string, newText: string) {
  const response = await api.patch<Comment>(`${baseUrl}/${commentId}`, {
    newText,
  });
  return response.data;
}

export async function deleteComment(commentId: string) {
  await api.delete(`${baseUrl}/${commentId}`);
}
