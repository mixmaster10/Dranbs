import {Component} from 'react'
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import Link from "next/link";
import {
    setAuth,
} from "../redux/actions";

import styles from '../styles/Landing.module.scss'

class Main extends Component {
    componentDidMount() {
        if (this.props.auth) {
            this.props.router.push('/home')
        }
    }

    render() {
        return (
            <div className="navbar-start is-flex-direction-column">
                <div className={styles.heading}>
                    <h1>DRANBS</h1>
                    <p>inspire your styles</p>
                </div>
                <div className="has-text-centered is-hidden-tablet">
                    <Link href={"/login"}>
                        <a className={`button is-black ${styles.login}`}>
                            Login / Sign up
                        </a>
                    </Link>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {setAuth})(withRouter(Main))
