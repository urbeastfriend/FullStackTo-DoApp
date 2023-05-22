import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/tasks_api";
import * as TasksApi from "../network/tasks_api"
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import stylesUtils from "../styles/utils.module.css"

interface LoginDialogProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
}

const LoginDialog = ({ onDismiss, onLoginSuccessful }: LoginDialogProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const user = await TasksApi.login(credentials);

            onLoginSuccessful(user);

        } catch (error) {
            alert(error);
            console.error(error);
        }
    }

    return ( 
        <Modal show onHide={() => onDismiss()}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Log in
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username} />

                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password} />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={stylesUtils.width100}
                    >
                        Log in
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
     );
}

export default LoginDialog;