import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../../Components/Firebase/firebase';
import Header from '../../Components/Layout/Header/Header';
import Post from '../../Components/Main Comps/Post/Post';

function PostDetails() {
  const [post, setPost] = useState()
  const params = useParams()
  const postId = params.post_id;

  useEffect(() => {
    const postQuery = query(collection(db, 'posts'), where('postId', '==', postId))
    onSnapshot(postQuery, (post) => {
      post.forEach(post => {
        setPost({ data: post.data(), postDocId: post.id })
      })
    })
  }, [postId])
  return (
    <Fragment>
      <Header />
      <div style={{marginTop:'90px'}}>
        {post && <Post postImgURL={post.data.postImage} postCaption={post.data.postCaption} postDocId={post.postDocId} postId={post.data.postId} userId={post.data.uid} />}
      </div>

    </Fragment>
  )
}

export default PostDetails
