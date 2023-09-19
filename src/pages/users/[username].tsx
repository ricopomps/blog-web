import { User } from "@/models/user";
import { GetServerSideProps } from "next";
import * as UsersApi from "@/network/api/user";
import * as BlogsApi from "@/network/api/blog";
import { useState } from "react";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import Head from "next/head";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import styles from "@/styles/UserProfilePage.module.css";
import ProfileImage from "@/components/ProfileImage";
import { formatDate, handleError } from "@/utils/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FormInputField from "@/components/form/FormInputField";
import LoadingButton from "@/components/LoadingButton";
import useSWR from "swr";
import BlogPostsGrid from "@/components/BlogPostsGrid";

export const getServerSideProps: GetServerSideProps<
  UserProfilePageProps
> = async ({ params }) => {
  const username = params?.username?.toString();
  if (!username) throw Error("Username missing");

  const user = await UsersApi.getUserByUsername(username);
  return { props: { user } };
};

interface UserProfilePageProps {
  user: User;
}

export default function UserProfilePage({ user }: UserProfilePageProps) {
  const { user: loggedInUser, mutateUser: mutateLoggegInUser } =
    useAuthenticatedUser();

  const [profileUser, setProfileUser] = useState(user);

  const profileUserIsLoggedInUser =
    (loggedInUser && loggedInUser._id === profileUser._id) || false;

  function handleUserUpdated(updatedUser: User) {
    mutateLoggegInUser(updatedUser);
    setProfileUser(updatedUser);
  }

  return (
    <>
      <Head>
        <title>{`${profileUser.username} - Blog`}</title>
      </Head>
      <div>
        <UserInfoSection user={profileUser} />
        {profileUserIsLoggedInUser && (
          <>
            <hr />
            <UpdateUserProfileSection onUserUpdated={handleUserUpdated} />
          </>
        )}
        <hr />
        <UserBlogPostsSection user={profileUser} />
      </div>
    </>
  );
}

interface UserInfoSectionProps {
  user: User;
}

function UserInfoSection({
  user: { username, displayName, profilePicUrl, about, createdAt },
}: UserInfoSectionProps) {
  return (
    <>
      <Row>
        <Col sm="auto">
          <ProfileImage
            src={profilePicUrl}
            width={200}
            height={200}
            alt={`Profile pic user: ${username}`}
            priority
            className={`rounded ${styles.profilePic}`}
          />
        </Col>
        <Col className="mt-2 mt-sm-0">
          <h1>{displayName}</h1>
          <div>
            <strong>Username: </strong>
            {username}
          </div>
          <div>
            <strong>User since: </strong>
            {formatDate(createdAt)}
          </div>
          <div className="pre-line">
            <strong>About me: </strong> <br />
            {about || "This user hasn't shared any info yet"}
          </div>
        </Col>
      </Row>
    </>
  );
}

const validationSchema = yup.object({
  displayName: yup.string(),
  about: yup.string(),
  profilePic: yup.mixed<FileList>(),
});

type UpdateUserProfileFormData = yup.InferType<typeof validationSchema>;

interface UpdateUserProfileSectionProps {
  onUserUpdated: (updatedUser: User) => void;
}

function UpdateUserProfileSection({
  onUserUpdated,
}: UpdateUserProfileSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateUserProfileFormData>();

  async function onSubmit({
    displayName,
    about,
    profilePic,
  }: UpdateUserProfileFormData) {
    if (!displayName && !about && (!profilePic || profilePic.length === 0))
      return;

    try {
      const updatedUser = await UsersApi.updateUser({
        displayName,
        about,
        profilePic: profilePic?.item(0) || undefined,
      });
      onUserUpdated(updatedUser);
    } catch (error) {
      handleError(error);
    }
  }
  return (
    <div>
      <h2>Update profile</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          register={register("displayName")}
          label="Display name"
          placeholder="Display name"
          maxLength={20}
        />
        <FormInputField
          register={register("about")}
          label="About"
          placeholder="About"
          as="textarea"
          maxLength={160}
        />
        <FormInputField
          register={register("profilePic")}
          label="Profile picture"
          placeholder="Profile picture"
          type="file"
          accept="image/png, image/jpeg"
        />
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Update profile
        </LoadingButton>
      </Form>
    </div>
  );
}

interface UserBlogPostsSectionProps {
  user: User;
}

function UserBlogPostsSection({ user }: UserBlogPostsSectionProps) {
  const {
    data: blogPosts,
    isLoading: blogPostsLoading,
    error: blogPostsLoadingError,
  } = useSWR(user._id, BlogsApi.getBlogPostsByUser);

  return (
    <div>
      <h2>Blog posts</h2>
      <div className="d-flex flex-column align-items-center">
        {blogPostsLoading && <Spinner animation="border" />}
        {blogPostsLoadingError && <p>Blog posts could not be loaded</p>}
        {blogPosts?.length === 0 && (
          <p>This user hasn&apos;t posted anything yet</p>
        )}
      </div>
      {blogPosts && <BlogPostsGrid posts={blogPosts} />}
    </div>
  );
}
