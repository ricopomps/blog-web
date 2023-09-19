import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/user";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useState } from "react";
import { BadRequestError, ConflictError } from "@/network/http-errors";

interface SingUpFormData {
  username: string;
  email: string;
  password: string;
}

interface SingUpModalProps {
  onDismiss: () => void;
  onLoginInsteadClicked: () => void;
}

export default function SingUpModal({
  onDismiss,
  onLoginInsteadClicked,
}: SingUpModalProps) {
  const { mutateUser } = useAuthenticatedUser();
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SingUpFormData>();

  async function onSubmit(credentials: SingUpFormData) {
    try {
      setErrorText(null);
      const newUser = await UsersApi.signUp(credentials);
      mutateUser(newUser);
      toast.success("Sign Up successful");
      onDismiss();
    } catch (error) {
      if (error instanceof ConflictError || error instanceof BadRequestError) {
        setErrorText(error.message);
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
        <Modal.Title>Sign Up</Modal.Title>
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
          <FormInputField
            register={register("email")}
            label="Email"
            placeholder="Email"
            error={errors.email}
            type="email"
          />
          <PasswordInputField
            register={register("password")}
            label="password"
            placeholder="password"
            error={errors.password}
          />
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            className="w-100"
          >
            Sign Up
          </LoadingButton>
        </Form>
        <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
          Already have an account?{" "}
          <Button variant="link" onClick={onLoginInsteadClicked}>
            Log In
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
