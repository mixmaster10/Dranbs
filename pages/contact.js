import React from 'react'
import Default from "../components/layout/Default";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import {
    setAuth,
    setSiteType,
} from "../redux/actions";

import Browse from "../components/bottom_nav/Browse"
import Manage from "../components/bottom_nav/Manage"
import BottomBar from "../components/bottom_nav/BottomBar"

import { submitTicket } from "../utils/api";

class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            message: '',
            error: null,
            success: null,

            isShowBrowse: false,
            isShowManage: false
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

    handleSubmit = async event => {
        event.preventDefault();

        try {
            const data = await submitTicket({
                name: this.state.name,
                email: this.state.email,
                message: this.state.message
            })
            this.setState({
                success: data.message,
                name: '',
                email: '',
                message: '',
                error: null
            })

        } catch (e) {
            this.setState({
                error: e.response.data,
                success: null
            })
        }
    }

    handleDelete = () => {
        this.setState({
            success: null
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
        this.setState({ isShowFilterButton: false, isShowFilter: false, isShowBrowse: false, isShowManage: false }, () => {
            if (value === 1) {
                this.props.setSiteType(1)
                this.props.router.push('/home')
            } else if (value === 2) {
                this.setState({
                    isShowBrowse: true
                })
            } else if (value === 4) {
                this.setState({
                    isShowManage: true
                })
            }
        })
    }

    render() {
        return (
            <Default>
                <div className="home-top-nav navbar is-fixed-top navbar-d-none mobile-top-bar">
                    <div>contact us</div>
                </div>
                <div id="hero-and-body" style={{ marginBottom: '70px' }}>
                    <section id="page-body">
                        <div className="spacer-big" />
                        <div className="columns clearfix">
                            <div className="column is-one-quarter">
                                <h5 className="title-alt">Write Us</h5>
                            </div>
                            <div className="column is-three-quarters">
                                {this.state.success && (
                                    <div className="notification is-success">
                                        <button className="delete" onClick={this.handleDelete} />
                                        {this.state.success}
                                    </div>
                                )}
                                <form id="contact-form" className="checkform sendemail" method="POST"
                                    onSubmit={this.handleSubmit}>
                                    <div className="field">
                                        <label htmlFor="name" className="label">Name <abbr title="required"
                                            className="required">*</abbr></label>
                                        <input type="text" name="name" id="name" value={this.state.name} required
                                            onChange={this.handleChange} className="input" />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="email" className="label">Email <abbr title="required"
                                            className="required">*</abbr></label>
                                        <input type="email" name="email" value={this.state.email} required
                                            onChange={this.handleChange} id="email" className="input" />
                                        {this.state.error && this.state.error.email && (
                                            this.state.error.email.map((message, index) => (
                                                <p key={index} className="help is-danger">{message}</p>
                                            ))
                                        )}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="message" className="label">Message <abbr title="required"
                                            className="required">*</abbr></label>
                                        <textarea name="message" id="message" value={this.state.message} required
                                            onChange={this.handleChange} className="input" rows="15" />
                                    </div>
                                    <div className="field">
                                        <input type="submit" name="submit" className="button is-primary signup"
                                            value="send" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>

                {this.state.isShowBrowse ? <Browse onClose={this.handleBrowseClose} /> : null}
                {this.state.isShowManage ? <Manage onClose={this.handleManageClose} /> : null}
                <BottomBar onSelect={this.handleBottomBarSelect} />
            </Default>
        )
    }
}

Contact.propTypes = {
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
    };
};

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
})(withRouter(Contact));