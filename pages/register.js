import {Component} from 'react'
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import Link from 'next/link'
import {registerUser} from "../utils/api";
import {setAuth} from "../redux/actions";
import styles from '../styles/Register.module.scss'
import Main from './landing'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            error: null,
            btn_visible: false
        }
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    handleRegister = async (event) => {
        event && event.preventDefault()
        this.setState({error: ''})

        try {
            let payload = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
            }
            let response = await registerUser(payload)
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
                        <p>Let's Get Started</p>
                        <p className={styles.subTitle}>Create a new account</p>
                    </div>
                </div>
                <div className="columns">
                    <div className="landing-body column is-two-thirds is-hidden-mobile">
                        { <Main />}
                    </div>
                    <div className="landing-body-right column is-one-thirds">
                        <form onSubmit={this.handleRegister}>
                            <div className="is-flex is-justify-content-center">
                                <div className={styles.register}>
                                    <div className="is-hidden-mobile">
                                        <h4 className={styles.heading}>Let's Get Started</h4>
                                        <p className={styles.subTitle}>Create a new account</p>
                                    </div>
                                    <div className={`field ${styles.socialButton}`}>
                                        <button className="button is-block is-fullwidth" ref={this.gRef}>
                                            <span className="icon"><img src="/icons/Google.svg"/></span> Continue with Google
                                        </button>
                                    </div>
                                    <div className={`field ${styles.socialButton}`}>
                                        <button className="button is-block is-fullwidth" onClick={this.handleFbClicked}>
                                            <span className="icon"><img src="/icons/Facebook.svg"/></span> Continue with facebook
                                        </button>
                                    </div>
                                    <div className={styles.divider}>
                                        <p>OR</p>
                                    </div>
                                    <div className="field">
                                        <div className="control has-icons-left">
                                            <input
                                                type="text"
                                                className="input"
                                                value={this.state.firstName}
                                                name="firstName"
                                                placeholder={"First Name"}
                                                required
                                                onChange={this.handleChange}
                                            />
                                            <span className="icon is-small is-left"><i className="fal fa-user" /></span>
                                        </div>
                                        {this.state.error && this.state.error.first_name && (
                                            this.state.error.first_name.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className="field">
                                        <div className="control has-icons-left">
                                            <input
                                                type="text"
                                                className="input"
                                                name="lastName"
                                                value={this.state.lastName}
                                                placeholder={"Last Name"}
                                                required
                                                onChange={this.handleChange}
                                            />
                                            <span className="icon is-small is-left"><i className="fal fa-user" /></span>
                                        </div>
                                        {this.state.error && this.state.error.last_name && (
                                            this.state.error.last_name.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className="field">
                                        <div className="control has-icons-left">
                                            <input
                                                type="email"
                                                className="input"
                                                name="email"
                                                value={this.state.email}
                                                placeholder={"Email"}
                                                onChange={this.handleChange}
                                                required
                                            />
                                            <span className="icon is-left"><i className="fal fa-envelope"/></span>
                                        </div>
                                        {this.state.error && this.state.error.email && (
                                            this.state.error.email.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className="field">
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="password"
                                                name="password"
                                                value={this.state.password}
                                                placeholder={"Password"}
                                                onChange={this.handleChange}
                                            />
                                            <span className="icon is-left"><i className="fal fa-lock-alt" /></span>
                                        </div>
                                    </div>
                                    <div className="field">
                                    { this.state.error && this.state.error.email? "" : <button className="button is-black is-block is-fullwidth">Sign Up</button> }
                                    </div>
                                    <div className="field">
                                        <p className={styles.footer}>have an account?<Link href="/">Sign in</Link></p>
                                    </div>
                                </div>
                            </div>
                            {this.state.error && this.state.error.email && (
                                this.state.error.email.map(() => (
                                <div className={styles.invalid_email}>
                                    <div className="is-flex columns">
                                        <div className="column is-half">
                                        <div className="field">
                                            <div className="control has-icons-left">
                                                <input
                                                    type="email"
                                                    className="input"
                                                    name="email"
                                                    value={this.state.email}
                                                    placeholder={"Email"}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                                <span className="icon is-left"><i className="fal fa-envelope"/></span>
                                            </div>
                                            {this.state.error && this.state.error.email && (
                                                this.state.error.email.map((message, index) => (
                                                    <p className="help is-danger" key={index}>
                                                        {message}
                                                    </p>
                                                ))
                                            )}
                                        </div>
                                        <div className="field">
                                            <div className="control has-icons-left">
                                                <input
                                                    className="input"
                                                    type="password"
                                                    name="password"
                                                    value={this.state.password}
                                                    placeholder={"Password"}
                                                    onChange={this.handleChange}
                                                />
                                                <span className="icon is-left"><i className="fal fa-lock-alt" /></span>
                                            </div>
                                            {this.state.error && this.state.error.email && (
                                                this.state.error.email.map((message, index) => (
                                                    <p className="help is-danger" key={index}>
                                                        {message}
                                                    </p>
                                                ))
                                            )}
                                        </div>
                                        </div>
                                        <div className="column is-half">
                                            <div className="field">
                                                <button className="button is-black is-block is-fullwidth">Sign Up</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))
                            )}
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, {setAuth})(withRouter(Register))
