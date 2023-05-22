import { Container } from 'react-bootstrap';
import LoginDialog from './components/LoginDialog';
import NavBar from './components/NavBar';
import SignUpDialog from './components/SignUpDialog';
import styles from "./styles/TasksPage.module.css";
import { useEffect, useState } from 'react';
import { User } from './models/user';
import * as TasksApi from "./network/tasks_api";
import TasksPageLoggedInView from './components/TasksPageLoggedInView';
import NotesPageLoggedOutView from './components/NotesPageLoggedOutView';

function App() {

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const [showSignUpDialog, setShowSignUpDialog] = useState(false);

    const [showLoginDialog, setShowLoginDialog] = useState(false);

    useEffect(() => {

        async function fetchLoggedInUser() {
            try {
                const user = await TasksApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.log(error);
            }
        }

        fetchLoggedInUser();
    }, []);

    return (
        <div>
            <NavBar
                loggedInUser={loggedInUser}
                onLoginClicked={() => { setShowLoginDialog(true) }}
                onLogoutSuccessful={() => { setLoggedInUser(null) }}
                onSignUpClicked={() => { setShowSignUpDialog(true) }}
            />
            <Container className={styles.tasksPage}>

                <>
                    {loggedInUser
                        ? <TasksPageLoggedInView />
                        : <NotesPageLoggedOutView />
                    }
                </>


            </Container>

            {showSignUpDialog &&
                <SignUpDialog
                    onDismiss={() => { setShowSignUpDialog(false)}}
                    onSignUpSuccessful={(user) => {
                        setLoggedInUser(user);
                        setShowSignUpDialog(false)
                     }}
                />
            }
            {showLoginDialog &&
                <LoginDialog
                    onDismiss={() => {setShowLoginDialog(false) }}
                    onLoginSuccessful={(user) => {
                        setLoggedInUser(user);
                        setShowLoginDialog(false)
                     }}
                />
            }
        </div>
    );
}

export default App;
