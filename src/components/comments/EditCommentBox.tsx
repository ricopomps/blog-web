import { Comment } from "@/models/comment";
import * as CommentApi from "@/network/api/comment";
import { handleError } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import LoadingButton from "../LoadingButton";
import FormInputField from "../form/FormInputField";
const validationSchema = yup.object({
  text: yup.string(),
});

type UpdateCommentInput = yup.InferType<typeof validationSchema>;

interface EditCommentBoxProps {
  comment: Comment;
  onCommentUpdated: (updatedComment: Comment) => void;
  onCancel: () => void;
}

export default function EditCommentBox({
  comment,
  onCommentUpdated,
  onCancel,
}: EditCommentBoxProps) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isSubmitting },
  } = useForm<UpdateCommentInput>({
    defaultValues: { text: comment.text },
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit({ text }: UpdateCommentInput) {
    if (!text) return;

    try {
      const updatedComment = await CommentApi.updateComment(comment._id, text);
      onCommentUpdated(updatedComment);
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    setFocus("text");
  }, [setFocus]);

  return (
    <div className="mt-2">
      <div className="mb-1">Edit Comment</div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField register={register("text")} as="textarea" max={600} />
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Submit
        </LoadingButton>
        <Button onClick={onCancel} className="ms-2" variant="outline-danger">
          Cancel
        </Button>
      </Form>
    </div>
  );
}
