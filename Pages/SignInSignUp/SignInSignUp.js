import { Fragment } from "react";
import SigninForm from "../../Components/Main Comps/Form/Signin";
import SignupForm from "../../Components/Main Comps/Form/Signup";
import {useLocation} from 'react-router-dom'


function SignInSignUp() {
    const pathName = useLocation().pathname;
    return(
        <Fragment>
            {pathName === '/login' ? <SigninForm  /> : <SignupForm />} 
        </Fragment>
    )
}

export default SignInSignUp;