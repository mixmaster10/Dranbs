import React from 'react'
import { withRouter } from "next/router";
import MasonryLayout from "react-masonry-layout";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { connect } from "react-redux";

import Board from "../components/Board";
import Browse from "../components/bottom_nav/Browse"
import Manage from "../components/bottom_nav/Manage"
import BottomBar from "../components/bottom_nav/BottomBar"
import Profile from "../components/layout/Profile";

import { getMyFollowings } from "../utils/api";
import { setAuth, setSiteType } from "../redux/actions";

import styles from "../styles/Home.module.scss";

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);

class MyFollowing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            width: '192px',
            fullyMounted: false,
            isLoadingData: false,

            isShowBrowse: false,
            isShowManage: false,

            hasMore: true,
        }
    }

    getInitialBoards = async () => {
        try {
            const response = await getMyFollowings(this.props.auth.meta.token, 0)
            if (response.data.length === 0) {
                this.setState({
                    hasMore: false,
                    fullyMounted: true
                })
                this.props.toggleLoaded(true)
                return
            } else {
                this.setState({
                    hasMore: true
                })
            }
            this.setState({
                data: response.data,
                dataPage: 1
            }, this.loadMoreBoards)
            this.props.toggleLoaded(true)
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/login')
        }
    }

    loadMoreBoards = async () => {
        if (this.state.isLoadingData)
            return
        if (!this.state.hasMore)
            return
        this.setState({ isLoadingData: true }, this.mount)
        try {
            const response = await getMyFollowings(this.props.auth.meta.token, this.state.dataPage)
            let data = response.data
            if (data.length === 0) {
                this.setState({
                    hasMore: false
                })
                return
            }

            this.setState({
                data: this.state.data.concat(data),
                dataPage: this.state.dataPage + 1,
                isLoadingData: false
            }, this.mount)
        } catch (e) {
            console.error(e)
        }
    }

    mount = () => {
        if (!this.state.fullyMounted) {
            window.addEventListener('resize', this.handleResize);
            const event = new Event('load');
            window.dispatchEvent(event)
            this.props.toggleLoaded(true)
            this.setState({ fullyMounted: true }, this.handleResize)
        }
    }

    handleResize = () => {
        const parentWidth = document.querySelector(".wrapper").getBoundingClientRect().width
        const browserWidth = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
        console.log(`Size: ${parentWidth}px`)
        console.log(`Browser Width: ${browserWidth}px`)
        let width
        if (browserWidth <= 768) {
            width = parentWidth - 100
        } else if (browserWidth <= 1024) {
            width = (parentWidth - 150) / 3
        } else {
            width = (parentWidth - 210) / 11
        }

        this.setState({ width })
    }

    repackItems = () => {
        if (this.instance) {
            const bricksInstance = this.instance.getBricksInstance();
            bricksInstance.pack()
        }
    }

    debounce = async () => {
        await repackDebounced()
        this.repackItems()
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
        this.setState({ isShowBrowse: false, isShowManage: false }, () => {
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

    async componentDidMount() {
        this.props.toggleLoaded(false)
        await this.getInitialBoards()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.props.toggleLoaded(false)
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.width !== this.state.width)) {
            this.repackItems()
        }
    }

    render() {
        if (!this.props.loaded) {
            return (
                <div id="page-loader" className="show-logo">
                    <span className="loader-icon bullets-jump"><span /><span /><span /></span>
                </div>
            )
        }
        return (
            <Profile headTitle="I follow" headIcon="dashboard">
                <div className="navbar is-fixed-top navbar-d-none mobile-top-bar">
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="/icons/dashboard.svg" />
                        <p style={{ marginLeft: "7px" }}>I follow</p>
                    </div>
                </div>
                <div className='following-body'>
                    <div id="page-content">
                        <div id="hero-and-body">
                            {this.props.loaded && ((this.state.data.length === 0 && this.props.loaded && this.state.fullyMounted) &&
                                <div className={styles.afterRegister}>
                                    <p className="has-text-centered">
                                        you are not following any board right now. <br />
                                        Just browse the section <strong>"boards"</strong> and <br />
                                        explore any board then click on the follow button.
                                    </p>
                                </div>)}
                            <section id="page-body">
                                <div className="is-hidden-tablet" style={{ height: '20px' }} />
                                <div className="wrapper">
                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[
                                            {
                                                mq: '500px',
                                                columns: 2,
                                                gutter: 7
                                            },
                                            {
                                                mq: '769px',
                                                columns: 3,
                                                gutter: 20
                                            },
                                            {
                                                mq: '1025px',
                                                columns: 11,
                                                gutter: 20
                                            }
                                        ]}
                                        infiniteScroll={async () => {
                                            await this.loadMoreBoards()
                                        }}
                                        infiniteScrollDistance={400}
                                    >
                                        {this.state.data.map((board, i) =>
                                            <Board
                                                width={this.state.width}
                                                board={board} key={i}
                                                onLoad={() => this.debounce()}
                                                showAuthor={true}
                                                isMine={false}
                                            />)}
                                    </MasonryLayout>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                {this.state.isShowBrowse ? <Browse onClose={this.handleBrowseClose} /> : null}
                {this.state.isShowManage ? <Manage onClose={this.handleManageClose} /> : null}
                <BottomBar onSelect={this.handleBottomBarSelect} />
            </Profile>
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
})(withRouter(MyFollowing))
