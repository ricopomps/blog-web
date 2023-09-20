import LoadingButton from "@/components/LoadingButton";
import FormInputField from "@/components/form/FormInputField";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import * as UsersApi from "@/network/api/user";
import { handleError } from "@/utils/utils";
import { usernameSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const validationSchema = yup.object({
  username: usernameSchema.required("Required"),
});

type OnBoardingInput = yup.InferType<typeof validationSchema>;
export default function OnboardingPage() {
  const { user, mutateUser } = useAuthenticatedUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnBoardingInput>({
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit({ username }: OnBoardingInput) {
    try {
      const updatedUser = await UsersApi.updateUser({
        username,
        displayName: username,
      });
      mutateUser(updatedUser);
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    if (user?.username) {
      const returnTo = router.query.returnTo?.toString();
      router.push(returnTo || "/");
    }
  }, [user, router]);

  return (
    <div>
      <h1>Onboarding</h1>
      <p>
        Thank you for signing up! Before you can continue, please set your
        username!
      </p>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          register={register("username")}
          placeholder="Username"
          error={errors.username}
          maxLength={20}
        />
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Submit
        </LoadingButton>
      </Form>
    </div>
  );
}
