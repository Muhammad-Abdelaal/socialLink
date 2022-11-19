import classes from './ExplorePosts.module.css';

import { collection, getDocs, query, orderBy, limit, getDoc, doc, startAfter } from "firebase/firestore";
import { db } from '../../Firebase/firebase';
import { useState, useEffect, useRef, useCallback } from 'react';
import ExplorePost from '../ExplorePost/ExplorePost';

function ExplorePosts() {
    const [explorePosts, setExplorePosts] = useState([]);
    const observer = useRef();

    useEffect(() => {
        const explorePostsQuery = query(collection(db,'explorePosts'), orderBy('createdAt','desc'), limit(9))
        async function getExlporeData() {
            let formattedExplorePosts = [];
            const querySnapshot = await getDocs(explorePostsQuery);
            querySnapshot.forEach((doc) => {
                formattedExplorePosts.push({data:doc.data(), postDocId:doc.id});   
            });
            setExplorePosts(formattedExplorePosts)
        }
        getExlporeData()
    }, []);

    const loadMorePosts = useCallback(async () => {
        const lastDocSnap = await getDoc(doc(db, 'explorePosts', explorePosts[explorePosts.length - 1].postDocId));
        const nextPostsQuery = query(collection(db, "posts"), orderBy('createdAt', 'desc'), startAfter(lastDocSnap), limit(9));
        const moreExplorePosts = await getDocs(nextPostsQuery)
        
            let formattedPosts = [];
            moreExplorePosts.forEach((document) => {
                formattedPosts = [...formattedPosts, { data: document.data(), postDocId: document.id }]
            });

            setExplorePosts(current => [...current, ...formattedPosts]);
        
    }, [ explorePosts]);

    const lastPostRef = useCallback(lastElemnt => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMorePosts();
            }
        })
        if (lastElemnt) observer.current.observe(lastElemnt)
    }, [loadMorePosts]);

    const explorePostsLists = explorePosts.map((item, index) => {
        if (explorePosts.length-1 === index) {
            return (
                <ExplorePost ref={lastPostRef} postId={item.data.postId} postDocId = {item.postDocId} explorePostImageURL={item.data.postImage} key={index} />
            )
        }
        else {
            return (
                <ExplorePost postId={item.data.postId} postDocId = {item.postDocId} explorePostImageURL={item.data.postImage} key={index} />
            )
        }
    });


    return (
        <div className={classes['explore-posts']}>
            {explorePostsLists}
        </div>
    )
}

export default ExplorePosts;