import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface CheckBoxProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    [x: string]: any,
}

const CheckBox = ({ name,label, register, registerOptions, ...props }: CheckBoxProps) => {
    return (
        <Form.Group>
            <Form.Check
                type="checkbox"
                label={label}
                {...register(name,registerOptions)}
            />
        </Form.Group>
    );
}

export default CheckBox;