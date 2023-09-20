import LoadingButton from "@/components/LoadingButton";
import FormInputField from "@/components/form/FormInputField";
import MarkDownEditor from "@/components/form/MarkdownEditor";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChangesWarning";
import * as BlogApi from "@/network/api/blog";
import { generateSlug, handleError } from "@/utils/utils";
import {
  requiredFileSchema,
  requiredStringSchema,
  slugSchema,
} from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { InferType } from "yup";

const validationSchema = yup.object({
  slug: slugSchema.required("Required"),
  title: requiredStringSchema,
  summary: requiredStringSchema,
  featuredImage: requiredFileSchema,
  body: requiredStringSchema,
});
type CreatePostFormData = InferType<typeof validationSchema>;

export default function CreateBlogPostPage() {
  const { user, userLoading } = useAuthenticatedUser();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreatePostFormData>({
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit({
    title,
    slug,
    summary,
    featuredImage,
    body,
  }: CreatePostFormData) {
    try {
      await BlogApi.createBlogPost({
        title,
        slug,
        summary,
        featuredImage: featuredImage[0],
        body,
      });
      toast.success("Blog created successfully");
      await router.push(`/blog/${slug}`);
    } catch (error) {
      handleError(error);
    }
  }

  function generateSlugFromTitle() {
    if (getValues("slug") || !getValues("title")) return;
    const slug = generateSlug(getValues("title"));
    setValue("slug", slug, { shouldValidate: true });
  }

  useUnsavedChangesWarning(isDirty && !isSubmitting);

  if (userLoading)
    return <Spinner animation="border" className="d-block m-auto" />;

  if (!user) router.push("/");

  return (
    <div>
      <h1>Create a post</h1>
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
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Create post
        </LoadingButton>
      </Form>
    </div>
  );
}
