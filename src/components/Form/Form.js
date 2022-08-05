import styles from "./form.module.css";
import Form from "react-bootstrap/Form";
import Text from "../../components/Text";
import Button from "../../components/Button";

const HomeForm = () => {
  return (
    <Form>
      <Form.Group
        className={`${styles.formGroup} mb-3`}
        controlId="formGroupName"
      >
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" placeholder="Enter your full name" />
      </Form.Group>
      <Form.Group
        className={`${styles.formGroup} mb-3`}
        controlId="formGroupEmail"
      >
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter your  email" />
      </Form.Group>
      <Form.Group
        className={`${styles.formGroup} mb-3`}
        controlId="formGroupPhone"
      >
        <Form.Label>phone number (optional)</Form.Label>
        <Form.Control type="tel" placeholder="Enter your  phone number" />
      </Form.Group>
      <Form.Group
        className={`${styles.formGroup} mb-5`}
        controlId="formGroupMessage"
      >
        <Form.Label>WRITE A MESSAGE</Form.Label>
        <Form.Control as="textarea" placeholder="Enter your message" />
      </Form.Group>
      <div
        className={`d-flex gap-4 align-items-center flex-wrap ${styles.btnDiv}`}
      >
        <Button type="primary">Submit</Button>
        <Text>
          By clicking “Subscribe”, I agree to share
          <br /> my contact information with Moivon.
        </Text>
      </div>
    </Form>
  );
};

export default HomeForm;
