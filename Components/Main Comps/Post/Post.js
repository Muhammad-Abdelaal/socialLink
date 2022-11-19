import SmallPfp from '../../UI/SmallPfp';
import classes from './Post.module.css';
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase';
import { useContext } from 'react';
import Context from '../../store/Context';
import CommentsSection from '../Comments/CommentsSection';
import EditButton from '../../UI/EditButton';
import { useNavigate } from 'react-router';

const Post = React.memo(React.forwardRef((props,ref) => {
    const ctx = useContext(Context)
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    // const [post, setPost] = useState();
    // const [interactionsCount, setInteractionsCount] = useState({ commentsCount: '', likesCount: '' }); // will use later
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);



    useEffect(() => {
        onSnapshot(doc(db, "usersData", props.userId), (doc) => {
            setUserName(doc.data().userInfo.userName)
        });
    }, [props.userId]);

    function commentsVisibiltyHandler() {
        setIsCommentsVisible(!isCommentsVisible)
    }

    function likeingHandler() {
        if (props.liked) {
            updateDoc(doc(db, 'posts', props.postDocId), {
                likes: arrayRemove(`${ctx.uid}`)
            })
        }
        else if (!props.liked) {
            updateDoc(doc(db, 'posts', props.postDocId), {
                likes: arrayUnion(`${ctx.uid}`)
            })
        }
    }
    
    function navigateProfile () {
        navigate(`/profile/${props.userId}`)
    }

    return (
        <div ref={ref} className={classes.post}>
            <div className={classes['post-data']}>
                <div className={classes['post-ownerdata-edit-container']}>
                    <div onClick={navigateProfile} className={classes['post-owner-data']}>
                        <SmallPfp userID={props.userId} />
                        <p className={classes['post-owner-name']}>{userName}</p>
                    </div>
                    {props.userId === ctx.uid && <EditButton postDoc = {props.postDocId} deleteFunction={props.deletingPost} />}
                </div>
                <div className={classes['post-caption']}>
                    {props.postCaption}
                </div>
                {props.postImgURL && <div className={classes['post-image-container']}>
                    <img alt='post' src={props.postImgURL} className={classes['post-image']} />
                </div>}
            </div>
            <div className={classes['like-comments-info']}>

            </div>
            <div style={isCommentsVisible ? { borderBottom: ' solid 1px #3E4042' } : {}} className={classes['post-interactions']}>
                <div className={classes['post-interaction-container']}>
                    <div onClick={likeingHandler} className={classes['post-interaction']}><FontAwesomeIcon style={props.liked ? {color:'hsl(214, 100%, 59%)'} : {}} icon={faThumbsUp} /> <p style={props.liked ? {color:'hsl(214, 100%, 59%)'} : {}}>{props.liked ? 'Liked' : 'Like'}</p></div>
                </div>
                <div className={classes['post-interaction-container']}>
                    <div onClick={commentsVisibiltyHandler} className={classes['post-interaction']}><FontAwesomeIcon icon={faComment} /> <p>Comments</p></div>
                </div>
            </div>
            {isCommentsVisible && <CommentsSection postId={props.postId} userId={props.userId} />}
        </div>
    )
}))

export default Post;