import classes from './UI.module.css';
import noImage from '../../Assets/noImage.webp'

import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../Firebase/firebase'

import {  useEffect, useState } from 'react';


function SmallPfp({ menuDisplayHandler, userID }) {
    const [userPics, setUserPics] = useState({ profilePic: '', profileCover: '' })


    useEffect(() => {
        onSnapshot(doc(db, "usersData", userID), (doc) => {
            setUserPics({ profilePic: doc.data().profilePictures.profilePicture, profileCover: doc.data().profilePictures.profileCover });
        });

    }, [userID])


    return (
        <img alt='pfp' src={userPics.profilePic === '' || !userPics.profilePic  ? noImage : userPics.profilePic} onClick={menuDisplayHandler} className={classes['small-pfp']} />
    )
}

export default SmallPfp;