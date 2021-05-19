import {Component} from 'react'
import React from "react";
import Select from 'react-select';
import {connect} from "react-redux";
import {withRouter} from "next/router";

import {getProfile, patchProfile} from "../utils/api";
import Default from "../components/layout/Default";
import {setAuth, setSiteType} from "../redux/actions";

import Browse from "../components/bottom_nav/Browse"
import Manage from "../components/bottom_nav/Manage"
import BottomBar from "../components/bottom_nav/BottomBar"
import DatePicker from "react-datepicker";
import {formatDate} from "../utils";

const genders = [
    {value: 2, label: 'Male'},
    {value: 1, label: 'Female'},
    {value: 0, label: 'Other'}
]

class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            gender: {value: 2, label: 'Male'},
            birthday: undefined,
            email: '',
            currentPassword: '',
            password: '',
            passwordAgain: '',
            error: null,
            message: '',
            isShowBrowse: false,
            isShowManage: false,
        }
    }

    componentDidMount() {
        getProfile(this.props.auth.meta.token).then(data => {
            let gender
            switch (data.gender) {
                case 1:
                    gender = {value: 1, label: 'Female'}
                    break
                case 2:
                    gender = {value: 2, label: 'Male'}
                    break
                default:
                    gender = {value: 0, label: 'Other'}
            }
            this.setState({
                firstName: data.first_name,
                lastName: data.last_name,
                gender: gender,
                email: data.email,
                birthday: undefined
            })
        }).catch(error => {
            this.props.setAuth(false)
            this.props.router.push('/login')
        })
    }

    handleBrowseClose = (value) => {
        this.setState({
            isShowBrowse: value,
            isShowFilterButton: true
        })
    }

    handleManageClose = (value) => {
        this.setState({
            isShowManage: value,
            isShowFilterButton: true
        })
    }

    handleBottomBarSelect = (value) => {
        this.setState({isShowBrowse: false, isShowManage: false}, () => {
            if (value === 1) {
                this.props.setSiteType(1)
                this.props.router.push('/home')
            } else if (value === 2) {
                this.setState({
                    isShowBrowse: !this.state.isShowBrowse
                })
            } else if (value === 4) {
                this.setState({
                    isShowManage: !this.state.isShowManage
                })
            }
        })
    }


    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    updateProfile = async (event) => {
        event && event.preventDefault()
        this.setState({error: null})

        try {
            let payload = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                gender: this.state.gender.value,
                email: this.state.email,
                birthday: formatDate(this.state.birthDay),
                currentPassword: this.state.currentPassword,
                password: this.state.password,
                password_confirm: this.state.passwordAgain
            }
            await patchProfile(this.props.auth.meta.token, payload)
            this.setState({
                message: 'Success !'
            })
        } catch (error) {
            this.setState({
                error: error.response.data
            })
        }
    }

    render() {
        return (
            <Default>
                <div className="navbar is-fixed-top navbar-d-none mobile-top-bar">
                    <div>my profile</div>
                </div>
                <div className="container is-mobile-profile" style={{maxWidth: '1000px', marginTop: '90px', marginBottom: '90px'}}>
                    <form onSubmit={this.updateProfile}>
                        {this.state.message && (
                            <div className="notification is-success">
                                {this.state.message}
                            </div>
                        )}
                        <div className="columns">
                            <div className="column">
                                <div style={{maxWidth: '343px', margin: 'auto'}}>
                                    <div className="field">
                                        <label className="label">First Name</label>
                                        <input
                                            type="text"
                                            className="input"
                                            name="firstName"
                                            value={this.state.firstName}
                                            placeholder={"First Name"}
                                            onChange={this.handleChange}
                                        />
                                        {this.state.error && this.state.error.first_name && (
                                            this.state.error.first_name.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className="field">
                                        <label className="label">Last Name</label>
                                        <input
                                            type="text"
                                            value={this.state.lastName}
                                            name="lastName"
                                            className="input"
                                            placeholder={"Last Name"}
                                            onChange={this.handleChange}
                                        />
                                        {this.state.error && this.state.error.last_name && (
                                            this.state.error.last_name.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className="field">
                                        <label className="label">Gender</label>
                                        <div className="control">
                                            <Select options={genders} value={this.state.gender} onChange={option => this.setState({gender: option})} instanceId="gender" />
                                        </div>
                                        {this.state.error && this.state.error.gender && (
                                            this.state.error.gender.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
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
                                            <span className="icon is-right"><i className="fal fa-calendar" /></span>
                                        </div>
                                        {this.state.error && this.state.error.birthday && (
                                            this.state.error.birthday.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div style={{maxWidth: '343px', margin: 'auto'}}>
                                    <div className="field">
                                        <label className="label">Change email</label>
                                        <div className="control has-icons-left">
                                            <input
                                                type="email"
                                                className="input"
                                                name="email"
                                                value={this.state.email}
                                                placeholder={"Email"}
                                                onChange={this.handleChange}
                                            />
                                            <span className="icon is-left"><i className="fal fa-envelope"></i></span>
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
                                        <label className="label">Old Password</label>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password"
                                                className="input"
                                                name="currentPassword"
                                                value={this.state.currentPassword}
                                                placeholder={"Current Password"}
                                                onChange={this.handleChange}
                                            />
                                            <span className="icon is-left"><i className="fal fa-lock-alt"></i></span>
                                        </div>
                                        {this.state.error && this.state.error.old_password && (
                                            this.state.error.old_password.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                    <div className="field">
                                        <label className="label">New Password</label>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password"
                                                className="input"
                                                name="password"
                                                value={this.state.password}
                                                placeholder={"New Password"}
                                                onChange={this.handleChange}
                                            />
                                            <span className="icon is-left"><i className="fal fa-lock-alt"></i></span>
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
                                        <label className="label">New password Again</label>
                                        <div className="control has-icons-left">
                                            <input
                                                type="password"
                                                className="input"
                                                name="passwordAgain"
                                                value={this.state.passwordAgain}
                                                placeholder={"New Password Again"}
                                                onChange={this.handleChange}
                                            />
                                            <span className="icon is-left"><i className="fal fa-lock-alt"></i></span>
                                        </div>
                                        {this.state.error && this.state.error.password_confirm && (
                                            this.state.error.password_confirm.map((message, index) => (
                                                <p className="help is-danger" key={index}>
                                                    {message}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field mt-6">
                            <div style={{maxWidth: '343px', margin: 'auto'}}>
                                <button className="button is-black is-block is-fullwidth" type='submit'>
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {this.state.isShowBrowse ? <Browse onClose={this.handleBrowseClose}/> : null}
                {this.state.isShowManage ? <Manage onClose={this.handleManageClose}/> : null}
                <BottomBar onSelect={this.handleBottomBarSelect}/>
            </Default>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        setSiteType: state.homeFilter.siteType,
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
})(withRouter(Settings))
