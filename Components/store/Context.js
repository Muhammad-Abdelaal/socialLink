import React, { useState } from "react";

// import firebase stuff to get the data from firestore
const Context = React.createContext({
    loginState:false,
    token:'',
    refToken:'',
    uid:'',
});

export function StoreProvider (props) {
    const initialData = JSON.parse(localStorage.getItem('TOKEN')) ? JSON.parse(localStorage.getItem('TOKEN')) : {
        loginState:false,
        token:'',
        refToken:'',
        uid:'',
    }
    const [userCurrentData , setUserCurrentData] = useState(initialData)
    
    const functions = {
        setInfoOnAuthed: (loginState, uid, token, refToken) => {
            setUserCurrentData({loginState, uid , token, refToken})
        }
    }

    const userDataContext =  {
        functions,
        loginState:userCurrentData.loginState,
        uid:userCurrentData.uid,
        token:userCurrentData.token,
        refToken:userCurrentData.refToken
    }
 
     return <Context.Provider  value = {userDataContext}> {props.children} </Context.Provider>
 }
 
 export default Context;