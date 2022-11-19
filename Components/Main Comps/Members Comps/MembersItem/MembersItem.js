import React from 'react';
import { useNavigate } from 'react-router';
import SmallPfp from '../../../UI/SmallPfp';
import classes from './MembersItem.module.css';

function MembersItem(props) {
    const navigate = useNavigate();

    function navigateProfile() {
        navigate(`/profile/${props.memberUID}`)
    }
    return (
        <div onClick={navigateProfile} className={classes['member-item']}>
            <SmallPfp userID={props.memberUID} />
            <div>{props.memberName}</div>
        </div>
    )
}

export default MembersItem
