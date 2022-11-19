
import classes from './Signupin.module.css';
import Context from "../../store/Context";
import { useRef, useContext, useState } from 'react';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";

import { useNavigate } from 'react-router-dom';

function SigninForm() {
    const [signInFeedbackState, setSignInFeedbackState] = useState({ state: false, error: null });
    const [signInFeedback, setSignInFeedback] = useState();
    const navigate = useNavigate()
    const emailRef = useRef();
    const passwordRef = useRef();
    const ctx = useContext(Context);

    async function submitHandler(e) {
        e.preventDefault();
        if (emailRef.current.value.trim() !== '' && passwordRef.current.value.trim() !== '' ) {
            try {
                const res = await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
                const user = res.user;
                ctx.functions.setInfoOnAuthed(true, user.uid, user.accessToken, user.refreshToken)
                const localStorageData = {loginState:true, uid:user.uid, token:user.token, refToken:user.refreshToken}
                localStorage.setItem('TOKEN', JSON.stringify(localStorageData))
                navigate('/');
            } catch (error) {
                const errorCode = error.code;
    
                setSignInFeedbackState({ state: true, error: true });
                if (errorCode === 'auth/wrong-password') {
                    setSignInFeedback('Incorrect Password')
                }
                else if (errorCode === 'auth/user-not-found') {
                    setSignInFeedback('Incorrect Email')
                }
                setTimeout(() => {
                    setSignInFeedbackState({ state: false, error: null });
                    setSignInFeedback('');
                }, 3000);
            }
        }
        else {
            setSignInFeedbackState({ state: true, error: true });
            setSignInFeedback('Please fill all input fields');
            setTimeout(() => {
                setSignInFeedbackState({ state: false, error: null });
                setSignInFeedback('');
            }, 3000);
        }
    }
    function switchToSignup() {
        navigate('/signUp')
    }

    return (
        <form className={classes['signin-signup-form']} onSubmit={submitHandler}>
            {signInFeedbackState.state  && <p style={signInFeedbackState.error ? { color: 'red', fontSize: '18px', display: 'block', fontWeight: '300', width: 'max-content', margin: '5px auto 10px auto' } : {}}>{signInFeedback}</p>}
            <label>Email</label>
            <input className={classes['form-input']} placeholder='Enter your Email address...' ref={emailRef} type='email' />
            <label>Password</label>
            <input className={classes['form-input']} placeholder='Enter your Password...' ref={passwordRef} type='password' />
            <button>Sign in</button>
            <p onClick={switchToSignup}>Create a new account</p>
        </form>
    )
}

export default SigninForm;