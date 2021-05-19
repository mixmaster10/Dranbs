import {Component} from 'react'
import React from "react";
import Select from 'react-select';
import DatePicker from 'react-datepicker'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import Link from 'next/link'
import {registerUser} from "../utils/api";
import {setAuth} from "../redux/actions";
import Default from "../components/layout/Default";

import styles from '../styles/Register.module.scss'
import {formatDate} from "../utils";

const genders = [
    {value: 2, label: 'Male'},
    {value: 1, label: 'Female'},
    {value: 0, label: 'Other'}
]

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            gender: {value: 2, label: 'Male'},
            birthDay: undefined,
            country: '',
            email: '',
            password: '',
            passwordConfirm: '',
            error: null
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
                gender: this.state.gender.value,
                email: this.state.email,
                password: this.state.password,
                password_confirm: this.state.passwordConfirm,
                birthday: formatDate(this.state.birthDay)
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
            <Default>
                <div className="container">
                    <div className="is-flex is-justify-content-center">
                        <div className={styles.register}>
                            <h4 className={styles.heading}>Let's Get Started</h4>
                            <p className={styles.subTitle}>Create a new account</p>
                            <form onSubmit={this.handleRegister}>
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
                                    <label className="label">Choose gender</label>
                                    <div className="control">
                                        <Select options={genders} value={this.state.gender} onChange={option => this.setState({gender: option})} instanceId="gender" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Your birthday</label>
                                    <div className="control has-icons-right">
                                        <DatePicker
                                            className="input"
                                            wrapperClassName="is-block"
                                            placeholderText="MM/DD/YYYY"
                                            dateFormat="MM/dd/yyyy"
                                            selected={this.state.birthDay}
                                            onChange={date => this.setState({birthDay: date})}
                                        />
                                        <span className="icon is-right"><i className="fal fa-calendar"/></span>
                                    </div>
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
                                    {this.state.error && this.state.error.password && (
                                        this.state.error.password.map((message, index) => (
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
                                            name="passwordConfirm"
                                            value={this.state.passwordConfirm}
                                            placeholder={"Password Again"}
                                            onChange={this.handleChange}
                                        />
                                        <span className="icon is-left"><i className="fal fa-lock-alt"/></span>
                                    </div>
                                    {this.state.error && this.state.error.password_confirm && (
                                        this.state.error.password_confirm.map((message, index) => (
                                            <p className="help is-danger" key={index}>
                                                {message}
                                            </p>
                                        ))
                                    )}
                                </div>
                                <div className="field">
                                    <button className="button is-black is-block is-fullwidth">Sign Up</button>
                                </div>
                                <div className="field">
                                    <p className={styles.footer}>have an account?<Link href="/login">Sign in</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Default>
        )
    }
}

export default connect(null, {setAuth})(withRouter(Register))
