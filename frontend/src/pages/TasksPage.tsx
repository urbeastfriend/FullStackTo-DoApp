import { Container } from "react-bootstrap";
import TasksPageLoggedInView from "../components/TasksPageLoggedInView";
import TasksPageLoggedOutView from "../components/TasksPageLoggedOutView";
import styles from "../styles/TasksPage.module.css";
import { User } from "../models/user";

interface TasksPageProps {
    loggedInUser: User | null,
    isAuthenticationComplete: boolean
}

const TasksPage = ({ loggedInUser, isAuthenticationComplete }: TasksPageProps) => {
    return (
        <Container className={styles.tasksPage}>
            <>
                {loggedInUser
                    ? <TasksPageLoggedInView />
                    : isAuthenticationComplete && <TasksPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default TasksPage;