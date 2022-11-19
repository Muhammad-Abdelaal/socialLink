import { useContext, useEffect, useRef, useState } from "react";
import SmallPfp from "../../UI/SmallPfp";
import classes from './NewPost.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import Context from "../../store/Context";
import { db, storage } from "../../Firebase/firebase";

import { v4 } from 'uuid';

import { doc, updateDoc, arrayUnion, addDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Loading from "../../UI/Loading";


function NewPost() {
    const ctx = useContext(Context);
    const [newPostFeedbackState, setNewPostFeedbackState] = useState({ state: false, error: null });
    const [newPostFeedback, setNewPostFeedback] = useState();
    const inputRef = useRef();
    const formRef = useRef();
    const userRef = doc(db, "usersData", ctx.uid);
    const [followers, setFollowers] = useState([])
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        onSnapshot(doc(db, "Followers", ctx.uid), (doc) => {
            setFollowers(doc.data().Followers);
        });
    }, [ctx.uid])

    async function newPostSumbitHandler(e) {
        e.preventDefault();
        let imageURL;
        const file = e.target[2].files[0];
        const postID = v4();

        const storageRef = file !== undefined ? ref(storage, `${ctx.uid}/posts/${file.name}${Math.random()}`) : '';
        const uploadImage = file !== undefined ? uploadBytesResumable(storageRef, file) : '';

        if (inputRef.current.value === '' && uploadImage === '') {
            setNewPostFeedbackState({ state: true, error: true });
            setNewPostFeedback("You can't make an EMPTY post");
            setTimeout(() => {
                setNewPostFeedbackState({ state: false, error: null });
                setNewPostFeedback('');
            }, 3000);
        }
        else if (inputRef.current.value === '' && uploadImage !== '') {
            setIsLoading(true)
            uploadImage.on('state_changed',
                null, null,
                () => {
                    getDownloadURL(uploadImage.snapshot.ref).then(async (downloadURL) => {
                        imageURL = downloadURL;
                        updateDoc(userRef, {
                            posts: arrayUnion({ postImage: imageURL, uid: ctx.uid, postId: postID })
                        })
                        addDoc(collection(db, 'explorePosts'), {
                            postImage: imageURL,
                            uid: ctx.uid,
                            postId: postID,
                            createdAt: serverTimestamp()
                        });
                        addDoc(collection(db, 'posts'), {
                            postImage: imageURL,
                            postCaption: null,
                            uid: ctx.uid,
                            postId: postID,
                            followers: [ctx.uid, ...followers],
                            likes: [],
                            createdAt: serverTimestamp()
                        })
                        setIsLoading(false)
                        setNewPostFeedbackState({ state: true, error: false });
                        setNewPostFeedback('Post has been made successfully')
                        setTimeout(() => {
                            setNewPostFeedbackState({ state: false, error: null });
                            setNewPostFeedback('');
                        }, 3000);
                        formRef.current.reset();
                    });
                }
            );

        }
        else if (uploadImage === '') {
            updateDoc(userRef, {
                posts: arrayUnion({ postCaption: inputRef.current.value, uid: ctx.uid, postId: postID })
            });
            addDoc(collection(db, 'posts'), {
                postImage: null,
                postCaption: inputRef.current.value,
                uid: ctx.uid,
                postId: postID,
                followers: [ctx.uid, ...followers],
                likes: [],
                createdAt: serverTimestamp()
            })
            inputRef.current.value = '';
        }
        else {
            uploadImage.on('state_changed',
                null, null,
                () => {
                    setIsLoading(true)
                    getDownloadURL(uploadImage.snapshot.ref).then(async (downloadURL) => {
                        imageURL = downloadURL;
                        await updateDoc(userRef, {
                            posts: arrayUnion({ postCaption: inputRef.current.value, postImage: imageURL, uid: ctx.uid, postId: postID })
                        });
                        await addDoc(collection(db, 'explorePosts'), {
                            postImage: imageURL,
                            uid: ctx.uid,
                            postId: postID,
                            createdAt: serverTimestamp()
                        });
                        addDoc(collection(db, 'posts'), {
                            postImage: imageURL,
                            postCaption: inputRef.current.value,
                            uid: ctx.uid,
                            postId: postID,
                            followers: [ctx.uid, ...followers],
                            likes: [],
                            createdAt: serverTimestamp()
                        })
                        setIsLoading(false)
                        setNewPostFeedbackState({ state: true, error: false });
                        setNewPostFeedback('Post has been made successfully')
                        setTimeout(() => {
                            setNewPostFeedbackState({ state: false, error: null });
                            setNewPostFeedback('');
                        }, 3000);
                        inputRef.current.value = '';
                        formRef.current.reset();
                    });
                }
            );

        }
    }

    return (
        <div className={classes['newpost-container']}>
           
            {newPostFeedbackState.state && !isLoading ? <p style={newPostFeedbackState.error ? { color: 'red', fontSize: '18px', display: 'block', fontWeight: '300',width:'max-content', margin: '5px auto 10px auto' } : { color: 'white', fontSize: '18px', display: 'block', fontWeight: '300',width:'max-content', margin: '5px auto 10px auto' }}>{newPostFeedback}</p> :
            isLoading && !newPostFeedbackState.state ? <Loading />  :''}
            <form ref={formRef} onSubmit={newPostSumbitHandler} style={{ width: '100%' }}>
                <div className={classes['newpost-input-pfp']}>
                    <SmallPfp userID={ctx.uid} />
                    <input ref={inputRef} className={classes['newpost-input']} type={'text'} placeholder="What's in your mind?" />
                    <button type="submit" className={classes['newpost-submit-button']}><FontAwesomeIcon className={classes['submit-button__icon']} icon={faCircleArrowRight} /></button>
                </div>
                <div className={classes['newpost-adding-file']}>
                    <input accept="image/*" className={classes['adding-new-img-input']} id='upload-image' type={'file'} />
                    <label htmlFor="upload-image" className={classes['adding-new-img-input-style']} >
                        <FontAwesomeIcon style={{ color: '#45BD62', fontSize: '20px' }} icon={faImages} />
                        <p style={{ color: '#ACAFB4', fontSize: '16px', marginLeft: '5px', fontWeight: '600' }}>Photo</p>
                    </label>
                </div>
            </form>
        </div>
    )
}

export default NewPost