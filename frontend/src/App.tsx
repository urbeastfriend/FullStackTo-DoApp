import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Task as TaskModel } from './models/task';
import Task from './components/Task';
import styles from "./styles/TasksPage.module.css"
import styleUtils from "./styles/utils.module.css"
import * as TasksApi from "./network/tasks_api";
import AddEditTaskDialog from './components/AddEditTaskDialog';
import { FaPlus } from "react-icons/fa";

function App() {

    const [tasks, setTasks] = useState<TaskModel[]>([]);

    const [tasksLoading, setTasksLoading] = useState(true);
    const [showTasksLoadingError, setShowTasksLoadingError] = useState(false);

    const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

    const [taskToEdit, setTaskToEdit] = useState<TaskModel | null>(null);

    // Receives two args, first is a side effect function, second is a dependency array
    // each time variables inside dependency array change - use effect is triggered
    // in case of empty array - its triggered only once
    // in case array param is not specified - it will trigger every render (bad)
    useEffect(() => {
        async function loadTasks() {
            try {
                setShowTasksLoadingError(false);
                setTasksLoading(true);
                const tasks = await TasksApi.fetchTasks();
                setTasks(tasks);
            } catch (error) {
                console.error(error);
                setShowTasksLoadingError(true);
            }
            finally {
                setTasksLoading(false);
            }
        }
        loadTasks();
    }, [])


    async function deleteTask(task: TaskModel) {
        try {
            await TasksApi.deleteTask(task._id);
            setTasks(tasks.filter(existingTask => existingTask._id !== task._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const tasksGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.tasksGrid}`}>
            {tasks.map(task => (
                <Col key={task._id}>
                    <Task
                        task={task}
                        className={styles.task}
                        onTaskClicked={(task) => setTaskToEdit(task)}
                        onDeleteTaskClicked={deleteTask}
                    />
                </Col>
            ))}
        </Row>

    return (
        <Container className={styles.tasksPage}>
            <Button
                onClick={() => {
                    setShowAddTaskDialog(true)
                }}
                className={`${styleUtils.blockCenter} ${styles.addTaskButton} ${styleUtils.flexCenter} mb-3`}>
                <FaPlus />
                Add new Task
            </Button>

            {tasksLoading && <Spinner animation='border' variant='primary'/>}
            {showTasksLoadingError && <p> Something went wrong, try refresh the page</p>}
            {!tasksLoading && !showTasksLoadingError &&
            <>
            {   tasks.length > 0
                ? tasksGrid
                : <p>You don't have any tasks yet</p>
            }
            </>
            }

            {/* && means dialog will only be shows if condition == true
            also we could instead pass boolean as property and use it as value for show property in modal
            difference is then dialog will save its input after we close the dialog
            but here we want to clear all input as we close the dialog
            */}
            {showAddTaskDialog &&
                <AddEditTaskDialog
                    onDismiss={() => setShowAddTaskDialog(false)}
                    onTaskSaved={(newTask) => {
                        setTasks([...tasks, newTask]);
                        setShowAddTaskDialog(false);
                    }}
                />
            }
            {taskToEdit &&
                <AddEditTaskDialog
                    taskToEdit={taskToEdit}
                    onDismiss={() => setTaskToEdit(null)}
                    onTaskSaved={(updatedTask) => {
                        setTasks(tasks.map(existingTask => existingTask._id === updatedTask._id ? updatedTask : existingTask))
                        setTaskToEdit(null)
                    }}

                />
            }
        </Container>
    );
}

export default App;
