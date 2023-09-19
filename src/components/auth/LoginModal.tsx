import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import * as UsersApi from "@/network/api/user";
import { BadRequestError } from "@/network/http-errors";
import { requiredStringSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import LoadingButton from "../LoadingButton";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";

const validationSchema = yup.object({
  username: requiredStringSchema,
  password: requiredStringSchema,
});

type LoginFormData = yup.InferType<typeof validationSchema>;

interface LoginModalProps {
  onDismiss: () => void;
  onSignUpInsteadClicked: () => void;
  onForgotPasswordClicked: () => void;
}

export default function LoginModal({
  onDismiss,
  onSignUpInsteadClicked,
  onForgotPasswordClicked,
}: LoginModalProps) {
  const { mutateUser } = useAuthenticatedUser();
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit(credentials: LoginFormData) {
    try {
      setErrorText(null);
      const newUser = await UsersApi.login(credentials);
      mutateUser(newUser);
      toast.success("Log In successful");
      onDismiss();
    } catch (error) {
      if (error instanceof BadRequestError) {
        setErrorText("Invalid credentials"); //change passport js to send the message
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
        } else if (typeof error === "string") {
          toast.error(error);
        } else if (isAxiosError(error)) {
          const axiosError = error as AxiosError<{ error: string }>;
          if (axiosError.response?.data?.error) {
            toast.error(axiosError.response.data.error);
          } else {
            toast.error("An error occurred.");
          }
        } else {
          toast.error("An error occurred.");
        }
      }
    }
  }

  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
  }

  return (
    <Modal onHide={onDismiss} centered show>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInputField
            register={register("username")}
            label="Username"
            placeholder="Username"
            error={errors.username}
          />
          <PasswordInputField
            register={register("password")}
            label="password"
            placeholder="password"
            error={errors.password}
          />
          <Button variant="link" className="d-block ms-auto mt-n3 mb-3 small">
            Forgot password?
          </Button>
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            className="w-100"
          >
            Log In
          </LoadingButton>
        </Form>
        <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
          Don&apos;t have an account yet?{" "}
          <Button variant="link" onClick={onSignUpInsteadClicked}>
            Sign Up
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
