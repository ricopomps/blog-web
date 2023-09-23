import { AuthModalsContext } from "@/app/AuthModalsProvider";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { Comment } from "@/models/comment";
import * as CommentApi from "@/network/api/comment";
import { handleError } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import LoadingButton from "../LoadingButton";
import FormInputField from "../form/FormInputField";

const validationSchema = yup.object({
  text: yup.string(),
});

type CreateCommentInput = yup.InferType<typeof validationSchema>;

interface CreateCommentBoxProps {
  blogPostId: string;
  parentCommentId?: string;
  title: string;
  onCommentCreated: (comment: Comment) => void;
  showCancel?: boolean;
  onCancel?: () => void;
  defaultText?: string;
}

export default function CreateCommentBox({
  blogPostId,
  parentCommentId,
  title,
  onCommentCreated,
  showCancel,
  onCancel,
  defaultText,
}: CreateCommentBoxProps) {
  const { user } = useAuthenticatedUser();
  const authModalsContext = useContext(AuthModalsContext);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setFocus,
  } = useForm({
    defaultValues: { text: defaultText || "" },
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit({ text }: CreateCommentInput) {
    if (!text) return;

    try {
      const createdComment = await CommentApi.createComment(
        blogPostId,
        parentCommentId,
        text
      );
      onCommentCreated(createdComment);
      reset();
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    if (parentCommentId) {
      setFocus("text");
    }
  }, [parentCommentId, setFocus]);

  if (!user) {
    return (
      <Button
        variant="outline-primary"
        className="mt-1"
        onClick={() => authModalsContext.showLoginModal()}
      >
        Log in to write a comment
      </Button>
    );
  }

  return (
    <div className="mt-2">
      <div className="mb-1">{title}</div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          register={register("text")}
          as="textarea"
          maxLength={600}
          placeholder="Say something..."
        />
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Send comment
        </LoadingButton>
        {showCancel && (
          <Button onClick={onCancel} className="ms-2" variant="outline-danger ">
            Cancel
          </Button>
        )}
      </Form>
    </div>
  );
}
