import { Fragment } from "react";
import Header from "../Header/Header";
import classes from './Main.module.css';

function Main(props) {

    return (
        <Fragment>
            <Header />
            <div className={classes.main}>{props.children}</div>
        </Fragment>
    )
}

export default Main;