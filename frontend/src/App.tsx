import LoginDialog from './components/LoginDialog';
import NavBar from './components/NavBar';
import SignUpDialog from './components/SignUpDialog';
import { useEffect, useState } from 'react';
import { User } from './models/user';
import * as TasksApi from "./network/tasks_api";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import TasksPage from './pages/TasksPage';
import InfoPage from './pages/InfoPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from "./styles/App.module.css"
function App() {

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const [isAuthenticationComplete, setIsAuthenticationComplete] = useState(false);

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
            finally{
                setIsAuthenticationComplete(true)
            }
        }

        fetchLoggedInUser();
    }, []);

    return (
        <BrowserRouter>
            <div>
                <NavBar
                    loggedInUser={loggedInUser}
                    onLoginClicked={() => { setShowLoginDialog(true) }}
                    onLogoutSuccessful={() => { setLoggedInUser(null) }}
                    onSignUpClicked={() => { setShowSignUpDialog(true) }}
                />

                <Container className={styles.pageContainer}>
                    <Routes>
                        <Route 
                        path='/'
                        element={<TasksPage loggedInUser={loggedInUser} isAuthenticationComplete={isAuthenticationComplete}/>}
                        />
                        <Route 
                        path='/info'
                        element={<InfoPage />}
                        />
                        <Route 
                        path='/*'
                        element={<NotFoundPage/>}
                        />
                    </Routes>
                </Container>

                {showSignUpDialog &&
                    <SignUpDialog
                        onDismiss={() => { setShowSignUpDialog(false) }}
                        onSignUpSuccessful={(user) => {
                            setLoggedInUser(user);
                            setShowSignUpDialog(false)
                        }}
                    />
                }
                {showLoginDialog &&
                    <LoginDialog
                        onDismiss={() => { setShowLoginDialog(false) }}
                        onLoginSuccessful={(user) => {
                            setLoggedInUser(user);
                            setShowLoginDialog(false)
                        }}
                    />
                }
            </div>
        </BrowserRouter>
    );
}

export default App;
