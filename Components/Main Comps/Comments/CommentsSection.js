import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { db } from '../../Firebase/firebase';
import Context from '../../store/Context';
import TinyPfp from '../../UI/TinyPfp';
import Comment from './Comment/Comment';
import classes from './CommentsSection.module.css'

function CommentsSection({ postId }) {
    const ctx = useContext(Context);
    const [comments, setComments] = useState([]);
    const [cuImage, setCUImage] = useState('')
    const inputRef = useRef();


    useEffect(() => {
        const currentUserRef = doc(db, 'usersData', ctx.uid)
        const commentsQuery = query(collection(db, "comments"), where("postId", '==', `${postId}`), orderBy('createdAt'));
        onSnapshot(commentsQuery, (commentsSnapshot) => {
            let formattedComments = [];
            commentsSnapshot.forEach((comment) => {
                formattedComments = [{ commentData: comment.data(), commentId: comment.id }, ...formattedComments]
            });
            setComments(formattedComments)
        })
        onSnapshot(currentUserRef, (doc) => {
            setCUImage(doc.data().profilePictures.profilePicture)
        });
    }, [postId, ctx.uid])



    function sendCommentHandler(e) {
        e.preventDefault();
        if (inputRef.current.value.trim() !== '') {
            addDoc(collection(db, 'comments'), {
                comment: inputRef.current.value,
                replies: [],
                postId,
                userId: ctx.uid,
                createdAt: serverTimestamp()
            })
        }
        inputRef.current.value = '';
    }


    const commentsList = comments.length !== 0 && comments.map((item) => {
        return (
            <Comment userId={item.commentData.userId} commentId={item.commentId} key={item.commentId} replies={item.commentData.replies} comment={item.commentData.comment} />
        )
    })

    return (
        <div className={classes['comments-section']}>
            <form style={{display:'flex', gap:'10px'}} onSubmit={sendCommentHandler}>
                <TinyPfp pfp = {cuImage} />
                <input ref={inputRef} className={classes['comment-input']} type={'text'} placeholder="Write a comment..." />
            </form>
            {commentsList}
        </div>
    )
}

export default CommentsSection
