import classes from './ProfileMain.module.css';
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { db } from '../../../Firebase/firebase';
import { onSnapshot, doc, query, collection, where, orderBy, getDoc, startAfter, limit, deleteDoc, getDocs } from "firebase/firestore";
import Post from '../../Post/Post';
import { useNavigate, useParams } from 'react-router';
import Context from '../../../store/Context';

function ProfileMain() {
    const ctx = useContext(Context)
    const params = useParams();
    const [posts, setPosts] = useState([]);
    const [userInfo, setUserInfo] = useState({  userInfo: { From: '', dob: '' } });
    const observer = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const profilePostsQuery = query(collection(db,'posts'), where('uid','==',`${params.user_id}`),orderBy('createdAt','desc'))
        onSnapshot(profilePostsQuery, (postsSnaphot) => {
            let formattedPosts = [];
            postsSnaphot.forEach((document) => {
                formattedPosts = [...formattedPosts, { data: document.data(), postDocId: document.id }]
            });
            setPosts(formattedPosts)
        })
        onSnapshot(doc(db, "usersData", params.user_id), (doc) => {
            if (doc._document === null) {
                navigate('/404')
            } 
            else {
                setUserInfo({ userInfo: doc.data().userInfo })
            }
            
        });
    }, [params.user_id, navigate]);

   


    const loadMorePosts = useCallback(async () => {
        const lastDocSnap = await getDoc(doc(db, 'posts', posts[posts.length - 1].postDocId));
        const nextPostsQuery = query(collection(db, "posts"), where('uid','==',`${params.user_id}`), orderBy('createdAt', 'desc'), startAfter(lastDocSnap), limit(3));
        onSnapshot(nextPostsQuery, (postsSnaphot) => {
            let formattedPosts = [];
            postsSnaphot.forEach((document) => {
                formattedPosts = [...formattedPosts, { data: document.data(), postDocId: document.id }]
            });

            setPosts(current => [...current, ...formattedPosts]);
        })
    }, [params.user_id, posts]);

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
        const itemIndex = posts.findIndex(post => post.postDocId === docId)
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
       if (posts.length-1 === index) {
        return (
            <Post key={index} deletingPost={deletingPost} ref = {lastPostRef} liked={item.data.likes.includes(ctx.uid) ? true : false} postImgURL={item.data.postImage} postDocId = {item.postDocId} postCaption={item.data.postCaption} postId={item.data.postId} userId={item.data.uid} />
        )
       }
       else {
        return (
            <Post key={index} deletingPost={deletingPost} liked={item.data.likes.includes(ctx.uid) ? true : false} postImgURL={item.data.postImage} postDocId = {item.postDocId} postCaption={item.data.postCaption} postId={item.data.postId} userId={item.data.uid} />
        )
       }
    }) : '';

    return (
        <div className={classes['profile-main-container']}>
            <div className={classes['profile-details']}>
                <h2>Intro</h2>
                {/* <li>Following: {userInfo.connection.Following.length}</li>
                <li>Followers: {userInfo.connection.Followers.length}</li> */}
                <li>From: {userInfo.userInfo.From}</li>
                <li>Lives in: {userInfo.userInfo.From}</li>
                <li>Date of birth: {userInfo.userInfo.dob}</li>
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ backgroundColor: '#242526', width: '90%', maxWidth: '700px', padding: '20px', color: 'white', margin: 'auto', marginTop: '30px', borderRadius: '12px' }}>
                    <h1>Posts</h1>
                </div>
                {
                    posts.length === 0 ?
                    <h1 style={{ margin: 'auto', color: '#3C3D3E', marginTop: '40px', width:'max-content' }}>No Posts</h1> :
                    postsList
                }
            </div>
        </div>
    )
}

export default ProfileMain;



