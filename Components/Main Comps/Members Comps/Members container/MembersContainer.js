import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../Firebase/firebase';
import MembersItem from '../MembersItem/MembersItem';
import classes from './MembersContainer.module.css';

function MembersContainer() {
    const [members, setMembers] = useState(null);

    useEffect(() => {
        async function getMembersData() {
            let docs = [];
            const querySnapshot = await getDocs(collection(db, "usersData"));
            querySnapshot.forEach((doc) => {
                docs.push({data:doc.data(), uid:doc.id});
            });
            setMembers(docs.reverse())
        }
        getMembersData()
    }, []);


    const memberList = members !== null  && members.map((item, index) => {
        return (
            <MembersItem key = {index} memberName = {item.data.userInfo.userName} memberUID = {item.uid} />
        )
    })

    return (
        <div className={classes['members-container']}>
            <div className={classes['members-title']}>
                <h1>Members</h1>
            </div>
            <div className={classes['members-list-container']}>
                {memberList}
            </div>
        </div>
    )
}

export default MembersContainer
