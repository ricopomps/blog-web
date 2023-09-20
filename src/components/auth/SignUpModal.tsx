import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import useCountdown from "@/hooks/useCountdown";
import * as UsersApi from "@/network/api/user";
import { BadRequestError, ConflictError } from "@/network/http-errors";
import { handleError } from "@/utils/utils";
import {
  emailSchema,
  passwordSchema,
  requiredStringSchema,
  usernameSchema,
} from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { InferType } from "yup";
import LoadingButton from "../LoadingButton";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import SocialSignInSection from "./SocialSignInSection";

const validationSchema = yup.object({
  username: usernameSchema.required("Required"),
  email: emailSchema.required("Required"),
  password: passwordSchema.required("Required"),
  verificationCode: requiredStringSchema,
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

  const [verificationCodeRequestPending, setVerificationCodeRequestPending] =
    useState(false);

  const [showVerificationCodeSentText, setShowVerificationCodeSentText] =
    useState(false);

  const {
    secondsLeft: verificationCodeCooldownSecondsLeft,
    start: startVerificationCodeCooldown,
  } = useCountdown();

  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SingUpFormData>({
    resolver: yupResolver(validationSchema),
  });

  async function requestVerificationCode() {
    const validEmailInput = await trigger("email");
    if (!validEmailInput) return;
    const emailInput = getValues("email");
    setErrorText(null);
    setShowVerificationCodeSentText(false);
    setVerificationCodeRequestPending(true);
    try {
      await UsersApi.requestEmailVerificationCode(emailInput);
      setShowVerificationCodeSentText(true);
      startVerificationCodeCooldown(60);
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else {
        handleError(error);
      }
    } finally {
      setVerificationCodeRequestPending(false);
    }
  }

  async function onSubmit(credentials: SingUpFormData) {
    try {
      setErrorText(null);
      setShowVerificationCodeSentText(false);
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

  return (
    <Modal onHide={onDismiss} centered show>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        {showVerificationCodeSentText && (
          <Alert variant="warning">
            We sent you a verification code, please check your inbox
          </Alert>
        )}
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
          <FormInputField
            register={register("verificationCode")}
            label="Verification code"
            placeholder="Verification code"
            type="number"
            error={errors.verificationCode}
            inputGroupElement={
              <Button
                id="button-send-verification-code"
                disabled={
                  verificationCodeRequestPending ||
                  verificationCodeCooldownSecondsLeft > 0
                }
                onClick={requestVerificationCode}
              >
                Send code
                {verificationCodeCooldownSecondsLeft > 0 &&
                  `(${verificationCodeCooldownSecondsLeft})`}
              </Button>
            }
          />
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            className="w-100"
          >
            Sign Up
          </LoadingButton>
        </Form>
        <hr />
        <SocialSignInSection />
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
