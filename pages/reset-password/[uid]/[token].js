import React from 'react'
import { withRouter } from "next/router";
import Default from "../../../components/layout/Default";

import styles from '../../../styles/ResetPassword.module.scss'
import {resetPassword} from "../../../utils/api";

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
            <Default>
                <div className="container">
                    <div className="is-flex is-justify-content-center" style={{paddingTop: '92px'}}>
                        <div className={styles.resetPassword}>
                            <h4 className={styles.heading}>Reset your password</h4>
                            <form onSubmit={this.handleSubmit}>
                                <div className={`field`}>
                                    <div className="control has-icons-left">
                                        <input
                                            type="password" className="input"
                                            placeholder="New Password"
                                            name="password"
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
                                            placeholder="Confirm Password"
                                            name="password"
                                            value={this.state.passwordConfirm}
                                            onChange={e => this.setState({passwordConfirm: e.target.value})} required />
                                        <span className="icon is-small is-left"><i className="fal fa-envelope" /></span>
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
            </Default>
        )
    }
}

export default withRouter(ResetPassword)