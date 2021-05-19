import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setSiteType} from "../../redux/actions";
import Sticky from "react-stickynode";
import BoardModal from "../BoardModal";
import {
    changeBoardInfo,
    deleteBoard,
    getBoardInfo,
    toggleFollowBoard,
} from "../../utils/api";
import Select from "react-select";
import {IndicatorSeparator, SingleValue, Option} from "../custom-select";
import BoardImageModal from "../BoardImageModal";
import LabelEditable from "../LabelEditable";
import TopNavCommon from "../TopNavCommon";

import Browse from "../bottom_nav/Browse";
import Manage from "../bottom_nav/Manage";
import BottomBar from "../bottom_nav/BottomBar";

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        top: "-7px",
        padding: 0,
        borderRadius: 0,
        fontSize: "14px",
    }),
    menuList: (provided, state) => ({
        ...provided,
        padding: 0,
    }),
    control: (provided) => ({
        ...provided,
        border: "unset",
        borderRadius: 0,
        fontSize: "14px",
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "black",
    }),
};

class BoardHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
            followers: 0,
            isFollowing: false,
            description: "",
            optionIndex: 1,
            imageFilename: null,
            isImageModalActive: false,
            name: "",
            prevName: "",

            sShowBrowse: false,
            isShowManage: false,

            scrollDirection: "scroll up",

            threshold: 0,
            isTicking: false,
            lastScrollY: window.pageYOffset,
        };
    }

    options = [
        {value: 0, label: "Private", icon: "far fa-lock-alt"},
        {value: 1, label: "Public", icon: "far fa-globe-americas"},
    ];

    async componentDidMount() {
        try {
            const data = await getBoardInfo(
                this.props.auth.meta.token,
                this.props.username,
                this.props.slug
            );
            this.setState({
                followers: data.followers,
                isFollowing: data.is_following,
                description: data.description,
                name: data.name,
                optionIndex: data.type,
                imageFilename: data.image_filename,
                prevName: data.name,
            });

            window.addEventListener("scroll", this.onScroll);
        } catch (e) {
            this.props.setAuth(false);
            await this.props.router.push("/login");
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    updateScrollDir = () => {
        const scrollY = window.pageYOffset;

        if (Math.abs(scrollY - this.state.lastScrollY) < this.state.threshold) {
            this.setState({isTicking: false});
            return;
        }

        this.handleScrollDownUp(
            scrollY > this.state.lastScrollY ? "scroll down" : "scroll up"
        );
        this.setState({lastScrollY: scrollY > 0 ? scrollY : 0});
        this.setState({isTicking: false});
    };

    onScroll = () => {
        if (!this.state.isTicking) {
            window.requestAnimationFrame(this.updateScrollDir);
            this.setState({isTicking: true});
        }
    };

    handleScrollDownUp(scrollDirection) {
        if (scrollDirection !== this.state.scrollDirection) {
            console.log("-------------------", scrollDirection);
            this.setState({scrollDirection: scrollDirection});
        }
    }

    handleToggleFollow = async () => {
        try {
            const data = await toggleFollowBoard(
                this.props.auth.meta.token,
                this.props.username,
                this.props.slug
            );
            this.setState({
                followers: data.followers,
                isFollowing: data.is_following,
            });
        } catch (e) {
            this.props.setAuth(false);
            await this.props.router.push("/login");
        }
    };

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
                        isShowBrowse: true,
                    });
                } else if (value === 4) {
                    this.setState({
                        isShowManage: true,
                    });
                }
            }
        );
    };

    showImageModal = () => {
        this.setState({
            isImageModalActive: true,
        });
    };

    closeImageModal = () => {
        document.getElementsByTagName("html")[0].style.overflowY = "scroll";
        this.setState({
            isImageModalActive: false,
        });
    };

    handleOptionChange = async (newOption) => {
        try {
            await changeBoardInfo(
                this.props.auth.meta.token,
                this.props.username,
                this.props.slug,
                {
                    type: newOption.value,
                }
            );
            this.setState({
                optionIndex: newOption.value,
            });
        } catch (e) {
            console.error(e);
        }
    };

    handleDeleteClicked = async () => {
        let r = confirm("Are you sure to delete this board?");
        if (r) {
            try {
                await deleteBoard(
                    this.props.auth.meta.token,
                    this.props.username,
                    this.props.slug
                );
                await this.props.router.push(`/boards/${this.props.username}`);
            } catch (e) {
                console.error(e);
            }
        }
    };

    handleBoardNameChange = async (value) => {
        try {
            this.setState({
                name: value,
            });
            await changeBoardInfo(
                this.props.auth.meta.token,
                this.props.username,
                this.props.slug,
                {
                    name: value,
                }
            );
        } catch (e) {
            alert(e.response.data.message);
            this.setState({
                name: this.state.prevName,
            });
        }
    };

    handleBoardDescriptionChange = async (value) => {
        try {
            this.setState({
                description: value,
            });
            await changeBoardInfo(
                this.props.auth.meta.token,
                this.props.username,
                this.props.slug,
                {
                    description: value,
                }
            );
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        return (
            <>
                <div className="navbar is-fixed-top is-transparent navbar-d-none">
                    <div className="mobile-top-bar">
                        <button
                            className="go-back"
                            onClick={() => this.props.router.back()}
                        >
                            {"<-"}
                        </button>
                        <>
                            {this.props.isMine ? (
                                <LabelEditable
                                    className="head"
                                    value={this.state.name}
                                    onChange={this.handleBoardNameChange}
                                />
                            ) : (
                                <a>{this.state.name}</a>
                            )}
                        </>
                    </div>
                    <div
                        className={
                            this.state.scrollDirection === "scroll down"
                                ? "scroll-down"
                                : "scroll-up"
                        }
                    >
                        <div className="board-top-bar filter">
                            <>
                                {!this.props.isMine ? (
                                    <div>
                                        <div
                                            style={{
                                                display: "inline",
                                                fontSize: "12px",
                                                color: "gray",
                                                marginRight: "5px",
                                            }}
                                        >
                                            by
                                        </div>
                                        <div style={{display: "inline"}}>
                                            {this.props.username}
                                        </div>
                                    </div>
                                ) : null}
                            </>
                            <div
                                style={{
                                    padding: "0px 10px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                }}
                            >
                                <>
                                    {this.props.isMine ? (
                                        <LabelEditable
                                            className="desc"
                                            value={this.state.description}
                                            emptyString={"add a description"}
                                            onChange={this.handleBoardDescriptionChange}
                                        />
                                    ) : (
                                        <p>{this.state.description}</p>
                                    )}
                                </>
                            </div>
                            {!this.props.isMine ? (
                                <div className="filter-item">
                                    <div>
                                        <button
                                            className={this.state.isFollowing ? "unfollow" : "follow"}
                                            onClick={this.handleToggleFollow}
                                        >
                                            {this.state.isFollowing ? "unfollow" : "follow"}
                                        </button>
                                    </div>
                                    <div style={{textAlign: "center"}}>
                                        {this.state.followers} followers
                                    </div>
                                </div>
                            ) : (
                                <div className="filter-item">
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <button
                                            className="hidden-sticky-active btn-no-border"
                                            onClick={() => {
                                                document.getElementsByTagName(
                                                    "html"
                                                )[0].style.overflowY = "hidden";
                                                this.showImageModal();
                                            }}
                                        >
                                            Change board image
                                        </button>
                                        <div
                                            className="hidden-sticky-active"
                                            style={{display: "inline-block", width: "120px"}}>
                                            <Select
                                                options={this.options}
                                                value={this.options[this.state.optionIndex]}
                                                styles={customStyles}
                                                components={{Option, SingleValue, IndicatorSeparator}}
                                                onChange={this.handleOptionChange}
                                            />
                                        </div>
                                    </div>
                                    <div style={{textAlign: "center"}}>
                                        <button
                                            className="btn-no-border"
                                            onClick={this.handleDeleteClicked}>
                                            delete board
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                        <ul>
                            <li>
                                <Link href="/boards">
                                    <a>boards</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/boards/${this.props.username}`}>
                                    <a>{this.props.username}</a>
                                </Link>
                            </li>
                            <li className="is-active">
                                {this.props.isMine ? (
                                    <LabelEditable
                                        className="head"
                                        value={this.state.name}
                                        onChange={this.handleBoardNameChange}
                                    />
                                ) : (
                                    <a>{this.state.name}</a>
                                )}
                            </li>
                        </ul>
                        <>
                            {this.props.isMine ? (
                                <LabelEditable
                                    className="desc"
                                    value={this.state.description}
                                    emptyString={"add a description"}
                                    onChange={this.handleBoardDescriptionChange}
                                />
                            ) : (
                                <p>{this.state.description}</p>
                            )}
                        </>
                        <div className="follow-piece">
                            {!this.props.isMine && (
                                <button
                                    className={this.state.isFollowing ? "unfollow" : "follow"}
                                    onClick={this.handleToggleFollow}
                                >
                                    {this.state.isFollowing ? "unfollow" : "follow"}
                                </button>
                            )}
                            <span className="followers">{this.state.followers} followers</span>
                            {this.props.isMine && (
                                <>
                                    <button
                                        className="hidden-sticky-active"
                                        onClick={() => {
                                            document.getElementsByTagName("html")[0].style.overflowY =
                                                "hidden";
                                            this.showImageModal();
                                        }}
                                    >
                                        Change board image
                                    </button>
                                    <button className="hidden-sticky-active"><i className="fal fa-share-alt mr-1" />share</button>
                                    <div
                                        className="hidden-sticky-active"
                                        style={{display: "inline-block", width: "120px"}}
                                    >
                                        <Select
                                            options={this.options}
                                            value={this.options[this.state.optionIndex]}
                                            styles={customStyles}
                                            components={{Option, SingleValue, IndicatorSeparator}}
                                            onChange={this.handleOptionChange}
                                        />
                                    </div>
                                    <button onClick={this.handleDeleteClicked}>
                                        delete board
                                    </button>
                                </>
                            )}
                        </div>
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

                <BoardModal onToggleSaved={this.props.onToggleSaved}/>
                {this.state.imageFilename && (
                    <BoardImageModal
                        imageFilename={this.state.imageFilename}
                        isActive={this.state.isImageModalActive}
                        slug={this.props.slug}
                        username={this.props.username}
                        onClose={() => this.closeImageModal()}
                    />
                )}
            </>
        );
    }
}

BoardHome.propTypes = {
    isMine: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    onToggleSaved: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth,
        setSiteType: state.homeFilter.siteType,
    };
};

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
})(withRouter(BoardHome));
