
import classes from './Signupin.module.css';
import Context from "../../store/Context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
    collection,
    doc, setDoc
} from 'firebase/firestore';
import { useRef, useContext, useState } from 'react';
import { db, auth } from "../../Firebase/firebase";

import { useNavigate } from 'react-router-dom';



function SignupForm() {
    const [signUpFeedbackState, setSignUpFeedbackState] = useState({ state: false, error: null });
    const [signUpFeedback, setSignUpFeedback] = useState();
    const navigate = useNavigate()
    const emailRef = useRef();
    const passwordRef = useRef();
    const userNameRef = useRef();
    const ctx = useContext(Context);
    const usersCollectionRef = collection(db, 'usersData');
    const usersFollowingRef = collection(db, 'Following');
    const usersFollowersgRef = collection(db, 'Followers');

    async function submitHandler(e) {
        e.preventDefault();
         // auth/email-already-in-use
        if (emailRef.current.value.trim() !== '' && passwordRef.current.value.trim() !== '' && userNameRef.current.value.trim() !== '') {
            try {
                const res = await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
                const user = res.user;
                setDoc(doc(usersCollectionRef, user.uid), {
                    posts: [],
                    connections: {
                        Followers: [],
                        Following: []
                    },
                    profilePictures: {},
                    userInfo: {
                        From: '',
                        Lives: '',
                        userAbout: '',
                        userAge: '',
                        userName: userNameRef.current.value,
                        userGender: ''
                    }
                })
                setDoc(doc(usersFollowingRef, user.uid), {
                    Following:[]
                })
                setDoc(doc(usersFollowersgRef, user.uid), {
                    Followers:[]
                })
                ctx.functions.setInfoOnAuthed(true, user.uid, user.accessToken, user.refreshToken);
                const localStorageData = {loginState:true, uid:user.uid, token:user.token, refToken:user.refreshToken}
                localStorage.setItem('TOKEN', JSON.stringify(localStorageData))
                navigate('/edit-profile');
            } catch (error) {
                const errorCode = error.code;

                setSignUpFeedbackState({ state: true, error: true });
                if (errorCode === 'auth/email-already-in-use') {
                    setSignUpFeedback('User already exists')
                }
                setTimeout(() => {
                    setSignUpFeedbackState({ state: false, error: null });
                    setSignUpFeedback('');
                }, 3000);
            }
        }
        else {
            setSignUpFeedbackState({ state: true, error: true });
            setSignUpFeedback('Please fill all input fields');
            setTimeout(() => {
                setSignUpFeedbackState({ state: false, error: null });
                setSignUpFeedback('');
            }, 3000);
        }



    }

    function switchToSignin() {
        navigate('/login')
    }

    return (
        <form className={classes['signin-signup-form']} onSubmit={submitHandler}>
            {signUpFeedbackState.state  && <p style={signUpFeedbackState.error ? { color: 'red', fontSize: '18px', display: 'block', fontWeight: '300', width: 'max-content', margin: '5px auto 10px auto' } : {}}>{signUpFeedback}</p>}
            <label>Username</label>
            <input className={classes['form-input']} placeholder='Enter your Username...' ref={userNameRef} type='text' />
            <label>Email</label>
            <input className={classes['form-input']} placeholder='Enter your Email address...' ref={emailRef} type='email' />
            <label>Password</label>
            <input className={classes['form-input']} placeholder='Enter your Password...' ref={passwordRef} type='password' />
            <button type='submit'>Sign up</button>
            <p onClick={switchToSignin}>Login with existing account</p>
        </form>
    )
}

export default SignupForm;