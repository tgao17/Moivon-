import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import Form from "react-bootstrap/Form";
import styles from "./form.module.css";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { postQuery } from "../../services/Queries";

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid Email").required("Required"),
  message: yup.string().required("Required"),
});

const HomeForm = () => {
  const toastId = useRef(null);

  const mutation = useMutation((newQuery) => postQuery({ query: newQuery }), {
    onSuccess: () => {
      toast.remove(toastId.current);
      const successId = toast.success("Query submitted successfully!");
      reset();
      setTimeout(() => toast.remove(successId), 3000);
    },
  });

  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
    reset,
  } = useForm({ resolver, mode: "onChange" });

  const onFormSubmit = (data) => {
    toastId.current = toast.loading("Submitting query!");
    mutation.mutate(data);
  };

  return (
    <Form as="form" onSubmit={handleSubmit(onFormSubmit)}>
      <Form.Group
        className={`${styles.formGroup} mb-3`}
        controlId="formGroupName"
      >
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your full name"
          autoComplete="off"
          {...register("name")}
        />
      </Form.Group>
      <Form.Group
        className={`${styles.formGroup} mb-3`}
        controlId="formGroupEmail"
      >
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your  email"
          {...register("email")}
        />
      </Form.Group>
      <Form.Group
        className={`${styles.formGroup} mb-3`}
        controlId="formGroupPhone"
      >
        <Form.Label>phone number (optional)</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Enter your  phone number"
          {...register("phone")}
        />
      </Form.Group>
      <Form.Group
        className={`${styles.formGroup} mb-5`}
        controlId="formGroupMessage"
      >
        <Form.Label>WRITE A MESSAGE</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Enter your message"
          {...register("message")}
        />
      </Form.Group>
      <div
        className={`d-flex gap-4 align-items-center flex-wrap ${styles.btnDiv}`}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isDirty || !isValid}
        >
          {isSubmitting ? "..." : "Submit"}
        </Button>
        <Text>
          By clicking “Subscribe”, I agree to share
          <br /> my contact information with Moivon.
        </Text>
      </div>
    </Form>
  );
};

export default HomeForm;
