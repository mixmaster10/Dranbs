import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setBoardSortType, setSiteType} from "../../redux/actions";
import Sticky from "react-stickynode";

import Browse from "../bottom_nav/Browse";
import Manage from "../bottom_nav/Manage";
import BottomBar from "../bottom_nav/BottomBar";

import TopNavCommon from "../TopNavCommon";
import Select from "react-select";

const customStyles = {
    container: (provided, state) => {
        return {
            ...provided,
            width: '143px',
        }
    },
    control: (provided, state) => {
        return {
            ...provided,
            minHeight: '24px',
            height: '24px',
            border: 0,
            backgroundColor: '#F7F7F7',
            borderRadius: 0
        }
    },
    indicatorSeparator: (provided, state) => {
        return {
            display: 'none'
        }
    },
    menu: (provided, state) => {
        return {
            ...provided,
            backgroundColor: '#F7F7F7',
            borderRadius: 0,
            paddingTop: 0,
            paddingBottom: 0,
            top: 0,
            marginTop: 0,
            marginBottom: 0
        }
    },
    valueContainer: (provided, state) => {
        return {
            ...provided,
            height: '24px',
        }
    },
    singleValue: (provided) => {
        return {
            ...provided,
            fontSize: '12px'
        }
    },
    dropdownIndicator: (provided, state) => {
        return {
            ...provided,
            color: 'black',
            height: '24px',
            padding: 0,
            alignItems: 'center'
        }
    },
    input: (provided, state) => {
        return {

        }
    },
    menuList: (provided, state) => {
        return {
            ...provided,
            paddingBottom: 0,
            paddingTop: 0
        }
    },
    option: (provided) => {
        return {
            ...provided,
            fontSize: '12px',
            color: 'black',
            padding: '4px 12px'
        }
    },
    placeholder: (provided) => {
        return {
            ...provided,
            fontSize: '12px'
        }
    }
}

class BoardListLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,

            sShowBrowse: false,
            isShowManage: false,
        };
    }

    options = [
        {value: 0, label: 'random'},
        {value: 1, label: '#followers'},
        {value: 2, label: 'newest'}
    ]

    handleBrowseClose = (value) => {
        this.setState({
            isShowBrowse: value,
        });
    };

    handleManageClose = (value) => {
        this.setState({
            isShowManage: value,
        });
    };

    handleBottomBarSelect = (value) => {
        this.setState(
            {isShowFilter: false, isShowBrowse: false, isShowManage: false},
            () => {
                if (value === 1) {
                    this.props.setSiteType(1);
                    this.props.router.push("/home");
                } else if (value === 2) {
                    this.setState({
                        isShowBrowse: !this.state.isShowBrowse,
                    });
                } else if (value === 4) {
                    this.setState({
                        isShowManage: !this.state.isShowManage,
                    });
                }
            }
        );
    };

    render() {
        return (
            <>
                <div className="home-top-nav navbar is-fixed-top navbar-d-none mobile-top-bar">
                    boards
                    <div>
                        {this.props.creator ? (
                            <button
                                className="go-back"
                                onClick={() => this.props.router.back()}
                            >
                                {"<-"}
                            </button>
                        ) : null}
                    </div>
                </div>

                <Sticky
                    enabled={this.state.stickyNav}
                    top={0}
                    bottomBoundary={0}
                    innerZ={1500}
                    activeClass={"sticky-active"}
                    releasedClass={"sticky-released"}
                >
                    <header>
                        <TopNavCommon/>
                    </header>
                    <section className="board-breadcrumb">
                        {this.props.creator ? (
                            <>
                                <ul>
                                    <li>
                                        <Link href="/boards">
                                            <a>boards</a>
                                        </Link>
                                    </li>
                                    <li className="is-active">
                                        <a>{this.props.creator}</a>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <div className="is-flex is-align-items-flex-end is-justify-content-space-between">
                                <div>
                                    <h3>all boards</h3>
                                    <p>Explore and follow boards created by users</p>
                                </div>
                                <div className="hidden-sticky-active is-flex is-align-items-center">
                                    <label style={{marginRight: '10px'}}>sort by</label>
                                    <Select
                                        options={this.options}
                                        styles={customStyles}
                                        value={this.props.sortType}
                                        onChange={(option) => this.props.setBoardSortType(option)}
                                        instanceId="sortBy" />
                                </div>
                            </div>
                        )}
                    </section>
                </Sticky>

                {this.state.isShowBrowse ? (
                    <Browse onClose={this.handleBrowseClose}/>
                ) : null}
                {this.state.isShowManage ? (
                    <Manage onClose={this.handleManageClose}/>
                ) : null}
                <BottomBar onSelect={this.handleBottomBarSelect}/>

                {this.props.children}
            </>
        );
    }
}

BoardListLayout.propTypes = {
    creator: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
        sortType: state.boardFilter.sortType
    };
};

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
    setBoardSortType
})(withRouter(BoardListLayout));
