import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { db } from '../../../Firebase/firebase';
import Context from '../../../store/Context';
import TinyPfp from '../../../UI/TinyPfp';
import Reply from '../Reply/Reply';
import classes from './Comment.module.css';

function Comment({ comment, replies, userId, commentId }) {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [isRepliesHidden, setIsRepliesHidden] = useState(false);

  const [cuImage, setCUImage] = useState('')
  const [userName_Image, setUserName_Image] = useState({ userName: '', userImage: '' });
  const replyRef = useRef();
  const ctx = useContext(Context);


  const commentDocRef = doc(db, 'comments', commentId);

  useEffect(() => {
    const currentUserRef = doc(db, 'usersData', ctx.uid)
    const docRef = doc(db, 'usersData', userId);
    onSnapshot(docRef, (doc) => {
      setUserName_Image({ userName: doc.data().userInfo.userName, userImage: doc.data().profilePictures.profilePicture })
    });
    onSnapshot(currentUserRef, (doc) => {
      setCUImage(doc.data().profilePictures.profilePicture)
    });
  }, [userId, ctx.uid])

  const repliesList = replies.length !== 0 && replies.map((item, index) => {
    return (
      <Reply userId={item.userId} key={index} reply={item.reply} />
    )
  })

  function replyVisibilityHandler() {
    setIsReplyVisible(!isReplyVisible)
  }
  function hideReplies() {
    setIsRepliesHidden(!isRepliesHidden)
  }
  function replyHandler(e) {
    e.preventDefault();
    if (replyRef.current.value.trim() !== '') {
      updateDoc(commentDocRef, {
        replies: arrayUnion({
          reply: replyRef.current.value,
          userId: ctx.uid
        })
      })
    }
    setIsRepliesHidden(true)
    setIsReplyVisible(false)
    replyRef.current.value = '';
  }
  return (
    <div>
      <div className={classes['comment-img__container']}>
        <TinyPfp pfp={userName_Image.userImage} />
        <div className={classes['comment-container']}>
          <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
            <div className={classes.comment}>
              <p style={{ fontWeight: '600', marginBottom: '7px' }}>{userName_Image.userName}</p>
              <p>{comment}</p>
            </div>
            {/* {userId === ctx.uid && <EditButton />} */}
          </div>
          <div className={classes['comment-actions']}>
            <p onClick={replyVisibilityHandler} style={{ marginLeft: '5px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '5px' }}>Reply</p>
            {replies.length !== 0 && <p onClick={hideReplies} style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '5px' }} >{isRepliesHidden ? 'Hide replys' : 'Show replys'}</p>}
          </div>
          {isReplyVisible &&
            <form onSubmit={replyHandler} style={{ display: 'flex', alignItems: 'center' }} className={classes['reply-form']}>
              <TinyPfp pfp={cuImage} />
              <input ref={replyRef} className={classes['reply-input']} placeholder={`reply to " ${userName_Image.userName} "`} />
            </form>
          }
        </div>
      </div>
      <div style={replies.length !== 0 && isRepliesHidden ? { display: 'block' } : {}} className={classes['replies-container']}>
        {repliesList}
      </div>
    </div>
  )
}

export default Comment
