import { useContext, useState } from 'react';
import classes from './Header.module.css';
import ProfileMenu from './profile-menu-picture/ProfileMenu';
import SmallPfp from '../../UI/SmallPfp';
import { useNavigate } from 'react-router';
import Context from '../../store/Context';

function Header() {
    const [isMenuOn, setIsMenuOn] = useState(false);
    const navigate = useNavigate();
    const ctx = useContext(Context)

    function menuDisplayHandler() {
        setIsMenuOn(!isMenuOn)
    }
    function navigateExplore() {
        navigate('/explore')
    }
    function navigateMembers() {
        navigate('/members')
    }
    return (
        <div className={classes.header}>
            <nav className={classes['header-nav']}>
                <div onClick={() => { navigate('/') }} className={classes.logo}> SocialLink</div>
                <nav className={classes['navigaton']}>
                    <div onClick={navigateExplore}>Explore</div>
                    <div onClick={navigateMembers}>Members</div>
                    <SmallPfp userID={ctx.uid} menuDisplayHandler={menuDisplayHandler} />
                    <ProfileMenu display={isMenuOn ? 'block' : 'none'} />
                </nav>

            </nav>
        </div>
    )
}

export default Header;