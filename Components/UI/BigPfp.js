import classes from './UI.module.css';
import noImage from '../../Assets/noImage.webp';


function BigPfp(props) {
    return (
        <img alt='pfp' src={props.pfp === '' || !props.pfp ? noImage : props.pfp} className={classes['big-pfp']} />

    )
}

export default BigPfp;