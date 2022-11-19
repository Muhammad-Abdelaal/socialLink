import classes from './ProfileMenu.module.css';
import {signOut } from "firebase/auth";
import { auth } from '../../../Firebase/firebase';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import Context from '../../../store/Context';


function ProfileMenu({display}) {
    const navigate = useNavigate();
    const ctx = useContext(Context);
    function signoutHandler () {
        signOut(auth).then(() => {
            ctx.functions.setInfoOnAuthed(false,null,null,null)
            localStorage.removeItem('TOKEN');
          }).catch((error) => {
            console.log(error)
          });
    }
    function headerNavigate (path) {
        navigate(path);
    }

    return (

        <div style = {{display:display}} className={classes['menu']}>
            <li onClick={()=>{headerNavigate(`/profile/${ctx.uid}`)}} className={classes['profile-menu-item']}>Profile</li>
            <li onClick={()=>{headerNavigate('/edit-profile')}} className={classes['profile-menu-item']}>Settings</li>
            {/* <li className={classes['profile-menu-item']}>Display</li> */}
            <li className={classes['profile-menu-item']} onClick={signoutHandler} >Signout</li>
        </div>
    )
}

export default ProfileMenu;