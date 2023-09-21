import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingButton from "@/components/LoadingButton";
import FormInputField from "@/components/form/FormInputField";
import MarkDownEditor from "@/components/form/MarkdownEditor";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChangesWarning";
import { BlogPost } from "@/models/blogPost";
import * as BlogApi from "@/network/api/blog";
import { NotFoundError } from "@/network/http-errors";
import { generateSlug, handleError } from "@/utils/utils";
import { requiredStringSchema, slugSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

export const getServerSideProps: GetServerSideProps<
  EditBlogPostPageProps
> = async ({ params }) => {
  try {
    const slug = params?.slug?.toString();
    if (!slug) throw Error("Slug missing");

    const post = await BlogApi.getBlogPostBySlug(slug);
    return { props: { post } };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true };
    } else {
      throw error;
    }
  }
};

interface EditBlogPostPageProps {
  post: BlogPost;
}

const validationSchema = yup.object({
  slug: slugSchema.required("Required"),
  title: requiredStringSchema,
  summary: requiredStringSchema,
  featuredImage: yup.mixed<FileList>(),
  body: requiredStringSchema,
});

type EditPostFormData = yup.InferType<typeof validationSchema>;

export default function EditBlogPostPage({ post }: EditBlogPostPageProps) {
  const { user, userLoading } = useAuthenticatedUser();
  const router = useRouter();

  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditPostFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      body: post.body,
    },
  });

  function generateSlugFromTitle() {
    if (getValues("slug") || !getValues("title")) return;
    const slug = generateSlug(getValues("title"));
    setValue("slug", slug, { shouldValidate: true });
  }

  async function onDeleteConfirmed() {
    setShowDeleteConfirmationDialog(false);
    setDeletePending(true);
    try {
      await BlogApi.deleteBlogPost(post._id);
      router.push("/blog");
      toast.success("Post deleted successfully");
    } catch (error) {
      handleError(error);
      setDeletePending(false);
    }
  }

  useUnsavedChangesWarning(isDirty && !isSubmitting && !deletePending);

  async function onSubmit({
    title,
    slug,
    summary,
    body,
    featuredImage,
  }: EditPostFormData) {
    try {
      await BlogApi.updateBlogPost(post._id, {
        title,
        slug,
        summary,
        body,
        featuredImage: featuredImage?.item(0) || undefined,
      });
      await router.push(`/blog/${slug}`);
    } catch (error) {
      handleError(error);
    }
  }

  const userIsAuthorized = (user && user._id === post.author._id) || false;

  if (!userLoading && !userIsAuthorized) {
    return <p>You are not authorized to edit this post</p>;
  }

  if (userLoading)
    return <Spinner animation="border" className="d-block m-auto" />;

  return (
    <div>
      <h1>Edit post</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          label="Post title"
          register={register("title")}
          placeholder="Post title"
          maxLength={100}
          error={errors.title}
          onBlur={generateSlugFromTitle}
        />
        <FormInputField
          label="Post slug"
          register={register("slug")}
          placeholder="Post slug"
          maxLength={100}
          error={errors.slug}
        />
        <FormInputField
          label="Post summary"
          register={register("summary")}
          placeholder="Post summary"
          maxLength={300}
          as="textarea"
          error={errors.summary}
        />
        <FormInputField
          label="Post image"
          register={register("featuredImage")}
          type="file"
          accept="image/png,image/jpeg"
          error={errors.featuredImage}
        />
        <MarkDownEditor
          label="Post body"
          register={register("body")}
          error={errors.body}
          setValue={setValue}
          watch={watch}
        />
        <div className="d-flex justify-content-between">
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            disabled={deletePending}
          >
            Update post
          </LoadingButton>
          <Button
            onClick={() => setShowDeleteConfirmationDialog(true)}
            variant="outline-danger"
            disabled={deletePending}
          >
            Delete post
          </Button>
        </div>
      </Form>
      <ConfirmationModal
        show={showDeleteConfirmationDialog}
        title="Confirm delete"
        message="Do you really want to delete this post?"
        confirmButtonText="Delete"
        onCancel={() => setShowDeleteConfirmationDialog(false)}
        onConfirm={onDeleteConfirmed}
        variant="danger"
      />
    </div>
  );
}
