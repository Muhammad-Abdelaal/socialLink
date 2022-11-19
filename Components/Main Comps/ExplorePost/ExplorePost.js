import React from 'react';
import { Link } from 'react-router-dom';
import classes from './ExplorePost.module.css';


const ExplorePost = React.memo(React.forwardRef((props, ref) => {
    
    return (

        <Link to={`/post/${props.postId}`}>
            <div ref={ref} style={{ backgroundImage: `url(${props.explorePostImageURL})` }} className={classes['explore-post']} />
        </Link>

    )
}))

export default ExplorePost;