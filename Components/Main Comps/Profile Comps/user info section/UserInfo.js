import { useContext, useState, useEffect } from 'react';
import Context from '../../../store/Context';
import BigPfp from '../../../UI/BigPfp';
import classes from './UserInfo.module.css';

import { db } from '../../../Firebase/firebase';
import { arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";

import { useNavigate, useParams } from 'react-router';
function UserInfo() {
    const params = useParams();
    const ctx = useContext(Context);
    const navigat = useNavigate();
    // const docRef = doc(db, "usersData", params.user_id);
    const [userName, setUserName] = useState('');
    const [userPics, setUserPics] = useState({ profilePic: '', profileCover: '' });
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();

    const postsQuery = query(collection(db, "posts"), where("uid", '==' , `${params.user_id}`));


    useEffect(() => {
        onSnapshot(doc(db, "usersData", params.user_id), (doc) => {
            if (doc._document === null) {
                navigate('/404')
            } 
            else {
                setUserPics({ profilePic: doc.data().profilePictures.profilePicture, profileCover: doc.data().profilePictures.profileCover })
                setUserName(doc.data().userInfo.userName);
            }
            
        });
        onSnapshot(doc(db, "Following", ctx.uid), (doc) => {
            setFollowing(doc.data().Following);
        });
    }, [params.user_id, ctx.uid, navigate]);


    function followHandler() {
        if (following.includes(params.user_id)) {
            updateDoc(doc(db, 'Followers', params.user_id), {
                Followers: arrayRemove(`${ctx.uid}`)
            })
            updateDoc(doc(db, 'Following', `${ctx.uid}`), {
                Following: arrayRemove(params.user_id)
            })
           async function postsFollowers() {
                const postsSnaphot = await getDocs(postsQuery);
                postsSnaphot.forEach((document) => {
                    updateDoc(doc(db, 'posts', document.id), {
                        followers: arrayRemove(`${ctx.uid}`)
                    })
                  });
            }  ;
            postsFollowers()
        }
        else {
            updateDoc(doc(db, 'Followers', params.user_id), {
                Followers: arrayUnion(`${ctx.uid}`)
            })
            updateDoc(doc(db, 'Following', `${ctx.uid}`), {
                Following: arrayUnion(params.user_id)
            })
            async function postsFollowers() {
                const postsSnaphot = await getDocs(postsQuery);
                postsSnaphot.forEach((document) => {
                    updateDoc(doc(db, 'posts', document.id), {
                        followers: arrayUnion(`${ctx.uid}`)
                    })
                  });
            }  ;
            postsFollowers()
        }
    }

    function navigateEditProfile() {
        navigat('/edit-profile');
    }


    return (
        <div className={classes['user-info-section']}>
            <div className={classes['user-info-section-content-container']}>
                <div style={userPics.profileCover ? { backgroundImage: `url(${userPics.profileCover})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' } : {}} className={classes['profile-cover-container']} />

                <div className={classes['user-info-container']}>
                    <div className={classes['user-pfp-name-container']} >
                        <BigPfp pfp={userPics.profilePic} />
                        <h1 className={classes['user-profile-name']}>{userName}</h1>
                    </div>
                    <div>
                        {ctx.uid === params.user_id && <button onClick={navigateEditProfile} className={classes['edit-profile-button']}>Edit profile</button>}
                        {ctx.uid !== params.user_id && <button style={following.includes(params.user_id) ? { backgroundColor: '#3c3d3e' } : { backgroundColor: '#2374E1' }} onClick={followHandler} className={classes['follow-profile-button']}>{following.includes(params.user_id) ? 'Followed' : "Follow"}</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo;