import React, { useState, useEffect } from 'react';
import styles from "../styles/Task.module.css"
import stylesUtil from "../styles/utils.module.css"
import { Card, FormCheck } from "react-bootstrap"
import { Task as TaskModel } from "../models/task"
import { formatDate } from "../utils/formatDate"
import { MdDelete } from "react-icons/md"


interface TaskProps {
    task: TaskModel,
    onTaskClicked: (task: TaskModel) => void,
    onDeleteTaskClicked: (task: TaskModel) => void,
    className?: string
}

const Task = ({ task,onTaskClicked, onDeleteTaskClicked, className }: TaskProps) => {

    const {
        name,
        isCompleted,
        isImportant,
        updatedAt,
        createdAt,
    } = task

    const [createdUpdatedText, setCreatedUpdatedText] = useState("");

    // regular way

    // let createdUpdatedText: string;
    // if(updatedAt > createdAt){
    //     createdUpdatedText = "Updated: " + formatDate(updatedAt);
    // }
    // else{
    //     createdUpdatedText = "Created: " + formatDate(createdAt);
    // }

    // formatting date is cheap operation and can be made without useeffect (triggered every recomposition)
    // but for expensive operations inside react components useEffect or useMemo should be used
    useEffect(() => {
        if (updatedAt > createdAt) {
            setCreatedUpdatedText("Updated: " + formatDate(updatedAt));
        }
        else {
            setCreatedUpdatedText("Created: " + formatDate(createdAt));
        }
    }, [createdAt, updatedAt])

    return (
        <Card className={`${styles.taskCard} ${className}`}
        onClick={() => {onTaskClicked(task)}}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={`${styles.cardText} ${stylesUtil.flexCenter} `}>
                    {name}
                    <MdDelete className={`text-muted ms-auto ${styles.mdDelete}`} 
                    onClick={(e) =>{
                        onDeleteTaskClicked(task);
                        e.stopPropagation();
                    }}
                    />
                </Card.Title>
                <FormCheck type="checkbox" label="Is important" checked={JSON.parse(isImportant)} readOnly className={styles.checkBoxNotClickable} />
                <FormCheck type="checkbox" label="Is completed" checked={JSON.parse(isCompleted)} readOnly className={styles.checkBoxNotClickable} />
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Task