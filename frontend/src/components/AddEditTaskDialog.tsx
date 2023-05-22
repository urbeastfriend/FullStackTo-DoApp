import { Button, Form, Modal } from "react-bootstrap";
import { Task } from "../models/task";
import { useForm } from "react-hook-form";
import { TaskInput } from "../network/tasks_api";
import * as TasksApi from "../network/tasks_api";

// ondismiss callback
interface AddEditTaskDialogProps {
    taskToEdit?: Task,
    onDismiss: () => void,
    onTaskSaved: (task: Task) => void
}

const AddEditTaskDialog = ({ taskToEdit, onDismiss, onTaskSaved }: AddEditTaskDialogProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskInput>({
        defaultValues: {
            taskName: taskToEdit?.name || "",
            isImportant: taskToEdit?.isImportant ? JSON.parse(taskToEdit.isImportant) : false,
            isCompleted: taskToEdit?.isCompleted ? JSON.parse(taskToEdit.isCompleted) : false,
        }
    });

    async function onSubmit(input: TaskInput) {
        try {
            let taskResponse: Task;
            if (taskToEdit) {
                taskResponse = await TasksApi.updateTask(taskToEdit._id, input)
            }
            else {
                taskResponse = await TasksApi.createTask(input)
            }
            onTaskSaved(taskResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        // onHide - action which triggers when we try to close the dialog
        // like clicking dialog or exit button
        <Modal show onHide={() => onDismiss()}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {taskToEdit ? "Edit note" : "Add note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditTaskForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Task</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Task name"
                            isInvalid={!!errors.taskName}
                            {...register("taskName", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.taskName?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Is important"
                            {...register("isImportant")}
                        />
                        {taskToEdit &&
                            <Form.Check
                                type="checkbox"
                                label="Is completed"
                                {...register("isCompleted")}
                            />

                        }
                    </Form.Group>

                </Form>
            </Modal.Body>

            {/* Since button is outside form we should connect it with id*/}
            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditTaskForm"
                    disabled={isSubmitting}
                >Save</Button>
            </Modal.Footer>
        </Modal>
    );
}



export default AddEditTaskDialog;