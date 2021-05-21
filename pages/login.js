import { Component } from 'react'
import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { withRouter } from "next/router";
import {loginUser, socialLogin} from "../utils/api";
import { setAuth } from "../redux/actions";
import styles from '../styles/Login.module.scss'
import Main from './landing'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: null,
        }
        this.gRef = React.createRef();
        this.auth2 = null
    }

    componentDidMount() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '1088245675677-0n50acbl70dsehpdr89f636ucmf1qa37.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
            });
            this.attachSignin(this.gRef.current)
        })
    }

    attachSignin = (element) => {
        this.auth2.attachClickHandler(element, {}, (googleUser) => {
            let authObj = googleUser.getAuthResponse()
            socialLogin('google', {
                token: authObj.id_token
            })
                .then(data => {
                    this.props.setAuth(data)
                    this.props.router.push("/home")
                })
                .catch(error => console.error(error))
        }, (error) => {
            console.log(JSON.stringify(error, undefined, 2));
        })
    }

    handleFbClicked = () => {
        FB.login(this.statusChangeCallback, {scope: 'email,public_profile', return_scopes: true});
    }

    statusChangeCallback = (response) => {
        if (response.status === 'connected') {
            const token = response.authResponse.accessToken
            socialLogin('facebook', {token})
                .then(data => {
                    this.props.setAuth(data)
                    this.props.router.push("/home")
                })
                .catch(error => console.error(error))
        }
    }

    handleLogin = async (event) => {
        event.preventDefault()
        this.setState({ loginError: null })
        const email = this.state.email
        const password = this.state.password

        try {
            const response = await loginUser({
                email: email,
                password: password
            })
            this.setState({
                error: null,
            })
            this.props.setAuth(response.data)
            await this.props.router.push("/home")
        } catch (error) {
            this.setState({
                error: error.response.data
            })
        }
    }

    render() {
        return (
            <div className="navbar-start is-flex-direction-column">
                <div className="is-hidden-tablet">
                    <div className={styles.heading}>
                        <h1>DRANBS</h1>
                        <p>inspire your styles</p>
                    </div>
                </div>
                 <div className="columns">
                    <div className="landing-body column is-two-thirds is-hidden-mobile">
                        { <Main />}
                    </div>  
                    <div className="landing-body-right column is-one-thirds">  
                        <div className="is-flex is-justify-content-center">
                            <div className={styles.login}>
                                <div className="is-hidden-mobile">
                                    <h4 className={styles.heading}>Welcome to DRANBS</h4>
                                    <p className={styles.subTitle}>Sign in to continue</p>
                                </div>
                                <div className={`field ${styles.socialButton}`}>
                                    <button className="button is-block is-fullwidth" ref={this.gRef}>
                                        <span className="icon"><img src="/icons/Google.svg"/></span> Sign in with Google
                                    </button>
                                </div>
                                <div className={`field ${styles.socialButton}`}>
                                    <button className="button is-block is-fullwidth" onClick={this.handleFbClicked}>
                                        <span className="icon"><img src="/icons/Facebook.svg"/></span> Sign in with facebook
                                    </button>
                                </div>
                                <div className={styles.divider}>
                                    <p>OR</p>
                                </div>
                                <form onSubmit={this.handleLogin}>
                                    {this.state.error && this.state.error.non_field_errors && (
                                        this.state.error.non_field_errors.map((message, index) => (
                                            <div className="notification is-danger" key={index}>
                                                {message}
                                            </div>
                                        ))
                                    )}
                                    <div className={`field ${styles.input}`}>
                                        <div className="control has-icons-left">
                                            <input
                                                type="email"
                                                className="input"
                                                placeholder="Your Email"
                                                value={this.state.email}
                                                onChange={e => this.setState({ email: e.target.value })}
                                            />
                                            <span className="icon is-small is-left"><i className="fal fa-envelope" /></span>
                                        </div>
                                        {this.state.error && this.state.error.email && (
                                            this.state.error.email.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className={`field ${styles.input}`}>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password"
                                                className="input"
                                                placeholder="Password"
                                                value={this.state.password}
                                                onChange={e => this.setState({ password: e.target.value })}
                                            />
                                            <span className="icon is-small is-left"><i className="fal fa-lock-alt" /></span>
                                        </div>
                                        {this.state.error && this.state.error.password && (
                                            this.state.error.password.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className={`field ${styles.button}`}>
                                        <button className="button is-black is-block is-fullwidth">Sign In</button>
                                    </div>
                                </form>
                                <div className="field has-text-centered">
                                    <Link href="/forgot-password">
                                        <a className={styles.link}>Forgot Password?</a>
                                    </Link>
                                </div>
                                <div className="field has-text-centered">
                                    <p className={styles.hint}>Don't have an account? <Link href="/register"><a className={styles.link}>Register</a></Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, { setAuth })(withRouter(Login))
