import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import * as UsersApi from "@/network/api/user";
import { BadRequestError, ConflictError } from "@/network/http-errors";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { InferType } from "yup";
import LoadingButton from "../LoadingButton";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import { handleError } from "@/utils/utils";

const validationSchema = yup.object({
  username: usernameSchema.required("Required"),
  email: emailSchema.required("Required"),
  password: passwordSchema.required("Required"),
});

type SingUpFormData = InferType<typeof validationSchema>;

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
  } = useForm<SingUpFormData>({
    resolver: yupResolver(validationSchema),
  });

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
        handleError(error);
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
            label="Password"
            placeholder="Password"
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
