import { collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";

import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { db } from "../../Firebase/firebase";
import Context from "../../store/Context";
import Post from "../Post/Post";


function Posts() {
    const [posts, setPosts] = useState([]);
    const ctx = useContext(Context);
    const observer = useRef();
    useEffect(() => {

        const postsQuery = query(collection(db, "posts"), where("followers", 'array-contains', `${ctx.uid}`), orderBy('createdAt', 'desc'), limit(3));
        onSnapshot(postsQuery, (postsSnaphot) => {

            postsSnaphot.forEach((document) => {

                setPosts(current => {
                    const existingItemIndex = current.findIndex(post => post.postDocId === document.id)
                    if (existingItemIndex === -1) {
                        if (current.length < 3) {
                            return [...current, { data: document.data(), postDocId: document.id }]
                        }
                        else {
                            return [{ data: document.data(), postDocId: document.id }, ...current]
                        }
                    }
                    else {
                        current[existingItemIndex] = { data: document.data(), postDocId: document.id }
                        return [...current]
                    }
                })


            });

        })

    }, [ctx.uid]);



    const loadMorePosts = useCallback(async () => {
        const lastDocSnap = await getDoc(doc(db, 'posts', posts[posts.length - 1].postDocId));
        const nextPostsQuery = query(collection(db, "posts"), where("followers", 'array-contains', `${ctx.uid}`), orderBy('createdAt', 'desc'), startAfter(lastDocSnap), limit(3));
        onSnapshot(nextPostsQuery, (postsSnaphot) => {
            postsSnaphot.forEach((document) => {
                setPosts(current => {
                    const existingItemIndex = current.findIndex(post => post.postDocId === document.id)
                    if (existingItemIndex === -1) {
                        return [...current, { data: document.data(), postDocId: document.id }]
                    }
                    else {
                        current[existingItemIndex] = { data: document.data(), postDocId: document.id }
                        return [...current]
                    }
                })
            });

        })
    }, [ctx.uid, posts]);

    const lastPostRef = useCallback(lastElemnt => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMorePosts();
            }
        })
        if (lastElemnt) observer.current.observe(lastElemnt)
    }, [loadMorePosts]);

    function deletingPost(docId) {
        const itemIndex = posts.findIndex(post => post.postDocId === docId);
        const explorePostQuery = query(collection(db, 'explorePosts'), where('postId', '==', `${posts[itemIndex].data.postId}`));
        deleteDoc(doc(db, 'posts', docId))
        setPosts(current => {
            current.splice(itemIndex, 1)
            return [...current]
        })
        
        getDocs(explorePostQuery).then(docs => {
            docs.forEach(post => {
                deleteDoc(doc(db, 'explorePosts', post.id))
            })
        })

    }

    const postsList = posts !== undefined ? posts.map((item, index) => {
        if (posts.length - 1 === index) {
            return (
                <Post key={index} deletingPost={deletingPost} liked={item.data.likes.includes(ctx.uid) ? true : false} ref={lastPostRef} postImgURL={item.data.postImage} postCaption={item.data.postCaption} postDocId={item.postDocId} postId={item.data.postId} userId={item.data.uid} />
            )
        }
        else {
            return (
                <Post deletingPost={deletingPost} liked={item.data.likes.includes(ctx.uid) ? true : false} key={index} postImgURL={item.data.postImage} postCaption={item.data.postCaption} postDocId={item.postDocId} postId={item.data.postId} userId={item.data.uid} />
            )
        }
    }) : '';




    return (
        <Fragment>
            {
                posts.length === 0 ?
                    <h1 style={{ margin: 'auto', color: '#3C3D3E', marginTop: '40px', width: 'max-content' }}>No Posts</h1> :
                    postsList
            }
        </Fragment>

    )
}

export default Posts;