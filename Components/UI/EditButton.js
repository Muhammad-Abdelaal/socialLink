import React, { useState } from 'react';
import classes from './UI.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

function EditButton({ editFunction, deleteFunction, postDoc }) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    function optionsState () {
        setIsOptionsOpen(!isOptionsOpen)
    }
    
    function actionsHandler (state) {
        if (state === 'delete') {
            deleteFunction(postDoc)
        }
        if (state === 'edit') {
            editFunction()
        }
        setIsOptionsOpen(false)
    }

    return (
        <div className={classes['edit']}>
           {isOptionsOpen && <div className={classes['options-list']} >
                {/* <div onClick={()=>{actionsHandler('edit')}}>Edit</div> */}
                <div onClick={()=>{actionsHandler('delete')}}>Delete</div>
            </div>}
            <div onClick={optionsState} className={classes['edit-button']}>
                <FontAwesomeIcon className={classes['edit-icon']} icon={faEllipsis} />
            </div>
        </div>

    )
}

export default EditButton
