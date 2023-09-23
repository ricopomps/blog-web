import * as BlogApi from "@/network/api/blog";
import { handleError } from "@/utils/utils";
import dynamic from "next/dynamic";
import { Form } from "react-bootstrap";
import {
  FieldError,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import Markdown from "../markdown/Markdown";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

interface MarkDownEditorProps {
  register: UseFormRegisterReturn;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  label?: string;
  error?: FieldError;
  editorHeight?: number;
  placeholder?: string;
}
export default function MarkDownEditor({
  register,
  watch,
  setValue,
  label,
  error,
  editorHeight = 500,
  placeholder = "Write something...",
}: MarkDownEditorProps) {
  async function uploadInPostImage(image: File) {
    try {
      const response = await BlogApi.uploadInPostImage(image);
      return response.imageUrl;
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label htmlFor={`${register.name}-input_md`}>{label}</Form.Label>
      )}
      <MdEditor
        {...register}
        id={`${register.name}-input`}
        renderHTML={(text) => <Markdown>{text}</Markdown>}
        onChange={({ text }) =>
          setValue(register.name, text, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        value={watch(register.name)}
        className={error ? "is-invalid" : ""}
        style={{ height: editorHeight }}
        placeholder={placeholder}
        onImageUpload={uploadInPostImage}
        imageAccept=".jpg,.png"
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error.message}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}
