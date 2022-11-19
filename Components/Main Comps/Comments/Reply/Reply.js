import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../Firebase/firebase';
import TinyPfp from '../../../UI/TinyPfp';
import classes from './Reply.module.css';

function Reply({userId, reply}) {
    const [userName_Image, setUserName_Image] = useState({ userName: '', userImage: '' });
    
    useEffect(() => {
        const docRef = doc(db, 'usersData', userId);
        onSnapshot(docRef, (doc) => {
          setUserName_Image({ userName: doc.data().userInfo.userName, userImage: doc.data().profilePictures.profilePicture })
        });
      }, [userId])

    return (
        <div className={classes['reply-container']} >
            <TinyPfp pfp={userName_Image.userImage} />
            <div className={classes.reply}>
                <p style={{ fontWeight: '600', marginBottom: '7px' }}>{userName_Image.userName}</p>
                <p>{reply}</p>
            </div>
        </div>
    )
}

export default Reply
