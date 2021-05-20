import React from 'react'
import { withRouter } from "next/router";

import styles from '../styles/ResetPassword.module.scss'
import { sendResetPasswordLink } from '../utils/api';
import Main from './landing'

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            message: null,
            error: null,
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await sendResetPasswordLink({
                email: this.state.email
            })
            this.setState({
                message: data.message,
                error: null
            })
        } catch(e) {
            this.setState({
                error: e.response.data,
                message: null,
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
                            <div className={styles.resetPassword}>
                                <h4 className={styles.heading}>You forgot your password</h4>
                                <p className={styles.subTitle}>enter your email</p>
                                <form onSubmit={this.handleSubmit}>
                                    {this.state.message && (
                                        <div className="notification is-success">{this.state.message}</div>
                                    )}
                                    <div className={`field`}>
                                        <div className="control has-icons-left">
                                            <input 
                                                type="email" className="input" 
                                                placeholder="Your Email" 
                                                name="email" 
                                                value={this.state.email} 
                                                onChange={e => this.setState({email: e.target.value})} />
                                            <span className="icon is-small is-left"><i className="fal fa-envelope" /></span>
                                        </div>
                                        {this.state.error && this.state.error.email && this.state.error.email.map(errorMsg => (
                                            <p className="help is-danger">{errorMsg}</p>
                                        ))}
                                    </div>
                                    <div className={`field`}>
                                        <button className="button is-black is-block is-fullwidth">Send</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ForgotPassword)