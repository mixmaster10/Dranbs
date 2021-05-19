import React from 'react'
import Link from "next/link";
import {Dashboard, Favorite} from "@material-ui/icons";
import {withRouter} from "next/router";
import {connect} from "react-redux";
import {setAuth, setSiteType} from "../redux/actions";
import {getNewCount} from "../utils/api";

class TopNavCommon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            totalNewCount: 0
        }
    }

    async componentDidMount() {
        const data = await getNewCount(this.props.auth.meta.token)
        const totalNewCount = data.new_count
        this.setState({totalNewCount})
    }

    displayNewCount = (newCount) => {
        if (newCount > 99) {
            return '99 +'
        } else if(newCount <= 99 && newCount >= 10) {
            return `+ ${newCount}`
        } else {
            return `+ 0${newCount}`
        }
    }

    handleLogout = async () => {
        this.props.setAuth(false)
        await this.props.router.push('/login')
    }

    render() {
        const router = this.props.router

        return (
            <nav className="navbar">
                <div className="navbar-menu">
                    <div className="navbar-start is-flex-direction-column">
                        <Link href={"/home"}>
                            <h1 className="brand">DRANBS<small> / inspire your styles</small></h1>
                        </Link>
                        <div className="is-flex">
                            <a className="navbar-item p-0"
                               onClick={() => {
                                   this.props.setSiteType(1)
                                   router.push('/home')
                               }}>
                                new arrivals
                            </a>
                            <a className="navbar-item p-0"
                               onClick={() => {
                                   this.props.setSiteType(2)
                                   router.push('/home')
                               }}>sale</a>
                            <Link href="/boards">
                                <a className={`navbar-item p-0 ${router.pathname == '/boards' ? 'is-active' : ''}`}>boards</a>
                            </Link>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field">
                                <p className="control has-icons-right">
                                    <input className="input" type="text" placeholder="Search"/>
                                    <span className="icon is-small is-right">
                                            <i className="fa fa-search"/>
                                        </span>
                                </p>
                            </div>
                        </div>
                        {this.props.auth ? (
                            <>
                                <Link href="/my-loves">
                                    <a className="navbar-item">
                                        <Favorite style={{color: '#FF3366', fontSize: 16, marginRight: '8px'}}/>
                                        I love
                                    </a>
                                </Link>
                                <Link href="/my-following">
                                    <a className="navbar-item">
                                        <Dashboard style={{fontSize: 16, marginRight: '8px', color: '#FA9805'}}/>
                                        I follow
                                        {this.state.totalNewCount > 0 && (
                                            <span className="new-count">{this.displayNewCount(this.state.totalNewCount)}</span>
                                        )}
                                    </a>
                                </Link>
                                <div className="navbar-item has-dropdown is-hoverable">
                                    <a className="navbar-link">
                                        {this.props.auth.user.username}
                                    </a>

                                    <div className="navbar-dropdown">
                                        <Link href={`/boards/${this.props.auth.user.username}`}>
                                            <a className="navbar-item">
                                                My boards
                                            </a>
                                        </Link>
                                        <Link href="/settings">
                                            <a className="navbar-item">
                                                my profile
                                            </a>
                                        </Link>
                                        <Link href="/contact">
                                            <a className="navbar-item">
                                                contact us
                                            </a>
                                        </Link>
                                        <a className="navbar-item" onClick={this.handleLogout}>
                                            log out
                                        </a>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <a className="navbar-item">login / sign up</a>
                            </Link>
                        )}

                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
})(withRouter(TopNavCommon))
