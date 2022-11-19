import React from 'react';
import classes from './UI.module.css';
import noImage from '../../Assets/noImage.webp';

function TinyPfp(props) {
  return (
    <img alt='pfp' src={props.pfp === '' || !props.pfp ? noImage : props.pfp} className={classes['tiny-pfp']} />
  )
}

export default TinyPfp
