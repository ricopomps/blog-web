import { Comment, CommentsPage } from "@/models/comment";
import api from "@/network/axiosInstance";

const baseUrl = "/comments";

export async function getCommentsForBlogPost(
  blogPostId: string,
  continueAfterId?: string
) {
  const response = await api.get<CommentsPage>(`${baseUrl}/${blogPostId}`, {
    params: {
      continueAfterId,
    },
  });
  return response.data;
}

export async function createComment(
  blogPostId: string,
  parentCommentId: string | undefined,
  text: string
) {
  const response = await api.post<Comment>(`${baseUrl}/${blogPostId}`, {
    text,
    parentCommentId,
  });
  return response.data;
}
