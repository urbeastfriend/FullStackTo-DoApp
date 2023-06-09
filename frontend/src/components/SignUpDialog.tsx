import { useForm } from "react-hook-form";
import { SignUpCredentials } from "../network/tasks_api";
import * as TasksApi from "../network/tasks_api";
import { User } from "../models/user";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import stylesUtils from "../styles/utils.module.css"
import {useState} from "react"
import { CredentialsConflictError } from "../errors/http_errors";

interface SignUpDialogProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

const SignUpDialog = ({ onDismiss, onSignUpSuccessful }: SignUpDialogProps) => {

    const [errorText, setErrorText] = useState<string|null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>()

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await TasksApi.signUp(credentials);

            onSignUpSuccessful(newUser);

        } catch (error) {
            if(error instanceof CredentialsConflictError)
            {
                setErrorText(error.message);
            }
            else{
                alert(error);
            }
            console.error(error);
        }
    }

    return (

        <Modal show onHide={() => onDismiss()}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorText&& 
                <Alert variant="danger">
                    {errorText}
                </Alert>
                }
                
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
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email} />

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
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>

    );
}

export default SignUpDialog;