import React from 'react'
import { withRouter } from "next/router";

import styles from '../../../styles/ResetPassword.module.scss'
import {resetPassword} from "../../../utils/api";
import Main from '../../index'

class ResetPassword extends React.Component {
    static async getInitialProps(ctx) {
        const {query} = ctx
        return {
            uid: query.uid,
            token: query.token
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            password: '',
            passwordConfirm: '',
            error: null,
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword({
                password: this.state.password,
                password_confirm: this.state.passwordConfirm,
                uid: this.props.uid,
                token: this.props.token
            })
            await this.props.router.push('/login')
        } catch(e) {
            this.setState({
                error: e.response.data,
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
                        <div className="is-flex is-justify-content-center">
                            <div className={styles.resetPassword}>
                                <h4 className={styles.heading}>Reset your password</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className={`field`}>
                                        <div className="control has-icons-left">
                                            <input
                                                type="email" className="input"
                                                placeholder="joedo@blabla.com"
                                                name="email"
                                                value={this.state.password}
                                                onChange={e => this.setState({password: e.target.value})} required />
                                            <span className="icon is-small is-left"><i className="fal fa-envelope" /></span>
                                        </div>
                                        {this.state.error && this.state.error.password && this.state.error.password.map(errorMsg => (
                                            <p className="help is-danger">{errorMsg}</p>
                                        ))}
                                    </div>
                                    <div className={`field`}>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password" className="input"
                                                placeholder="New Password"
                                                name="password"
                                                value={this.state.password}
                                                onChange={e => this.setState({password: e.target.value})} required />
                                            <span className="icon is-small is-left"><i className="fal fa-lock-alt" /></span>
                                        </div>
                                        {this.state.error && this.state.error.password && this.state.error.password.map(errorMsg => (
                                            <p className="help is-danger">{errorMsg}</p>
                                        ))}
                                    </div>
                                    <div className={`field`}>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password" className="input"
                                                placeholder="Confirm Password"
                                                name="password"
                                                value={this.state.passwordConfirm}
                                                onChange={e => this.setState({passwordConfirm: e.target.value})} required />
                                            <span className="icon is-small is-left"><i className="fal fa-lock-alt" /></span>
                                        </div>
                                        {this.state.error && this.state.error.password_confirm && this.state.error.password_confirm.map(errorMsg => (
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

export default withRouter(ResetPassword)