import { Fragment } from "react";
import Header from "../../Components/Layout/Header/Header";
import ProfileMain from "../../Components/Main Comps/Profile Comps/Main Section/ProfileMain";
import UserInfo from "../../Components/Main Comps/Profile Comps/user info section/UserInfo";


function Profile() {

    return (
        <Fragment>
            <Header />
            <UserInfo />
            <ProfileMain />
        </Fragment>
    )
}

export default Profile;