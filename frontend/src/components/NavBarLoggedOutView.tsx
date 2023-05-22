import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onLoginClicked: () => void,
    onSignUpClicked: () => void,

}

const NavBarLoggedOutView = ({onLoginClicked,onSignUpClicked}: NavBarLoggedOutViewProps) => {
    return ( 
        <>
            <Button onClick={onSignUpClicked}>
                Sign up
            </Button>
            <Button onClick={onLoginClicked}>
                Log in
            </Button>
        </>
     );
}

export default NavBarLoggedOutView;