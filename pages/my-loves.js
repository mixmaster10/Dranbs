import React, { Component } from 'react'
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import { getMyLoves } from "../utils/api";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import styles from '../styles/Home.module.scss'
import Product from "../components/Product";
import Profile from "../components/layout/Profile";
import { setAuth, setSiteType } from "../redux/actions";

import Browse from "../components/bottom_nav/Browse"
import Manage from "../components/bottom_nav/Manage"
import BottomBar from "../components/bottom_nav/BottomBar"

class MyLoves extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            width: '300px',
            stickyNav: true,
            fullyMounted: false,

            isShowBrowse: false,
            isShowManage: false,
        }
    }

    async componentDidMount() {
        this.props.toggleLoaded(false)
        await this.getInitialProducts()
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

    getInitialProducts = async () => {
        try {
            const response = await getMyLoves(this.props.auth.meta.token, 0)
            this.setState({
                data: response.data,
                dataPage: 1
            }, this.loadMoreProducts)
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/login')
        }
        this.props.toggleLoaded(true)
    }

    loadMoreProducts = async () => {
        if (this.state.isLoadingData)
            return
        this.setState({ isLoadingData: true }, this.mount)
        try {
            const response = await getMyLoves(this.props.auth.meta.token, this.state.dataPage)
            let data = response.data

            this.setState({
                data: this.state.data.concat(data),
                dataPage: this.state.dataPage + 1,
                isLoadingData: false
            }, this.mount)
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/login');
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

    handleToggleSaved = ({ productId, saved }) => {
        let products = [...this.state.data]
        let index = this.state.data.findIndex(p => p.id === productId)
        let product = { ...products[index] }
        product.saved = saved
        products[index] = product
        this.setState({
            data: products
        })
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
            width = parentWidth
        } else if (browserWidth <= 1024) {
            width = (parentWidth - 130) / 3
        } else {
            width = (parentWidth - 115) / 6
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
        if (!this.props.loaded) {
            return <div id="page-loader" className="show-logo">
                <span className="loader-icon bullets-jump"><span /><span /><span /></span>
            </div>
        }

        return (
            <Profile headTitle="I love" headIcon="favorite" onToggleSaved={this.handleToggleSaved}>
                <div className="navbar is-fixed-top navbar-d-none mobile-top-bar">
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <img src="/icons/favorite.svg" />
                        <p style={{ marginLeft: "7px" }}>I love</p>
                    </div>
                </div>
                <div className='love-body'>
                    <div id="page-content">
                        <div id="hero-and-body">
                            {/* PAGEBODY */}
                            {this.props.loaded && ((this.state.data.length === 0 && this.props.loaded && this.state.fullyMounted) &&
                                <div className={styles.afterRegister}>
                                    <p className="has-text-centered">
                                        You have no items yet in this section. <br />
                                        Just explore and click on the love icon for items you wish to buy soon or later. <br />
                                        Be aware that this section is not an archive. <br />
                                        When the item is not anymore available on the brand site <br />
                                        it will be removed from our site and this section.
                                    </p>
                                </div>)}
                            <section id="page-body">
                                <div className="is-hidden-tablet" style={{ height: '20px' }} />
                                <div className="wrapper">

                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[{ columns: 1, gutter: 20 }, {
                                            mq: '769px',
                                            columns: 3,
                                            gutter: 20
                                        }, { mq: '1025px', columns: 6, gutter: 20 }]}
                                        infiniteScroll={async () => {
                                            await this.loadMoreProducts()
                                        }}
                                        infiniteScrollDistance={400}
                                    >
                                        {this.state.data.map((product, i) => <Product width={this.state.width}
                                            product={product} key={i}
                                            onLoad={() => this.debounce()}
                                            isBrand={false} />)}
                                    </MasonryLayout>
                                    {/*</div>*/}
                                </div>
                                {/* END .wrapper */}
                            </section>
                            {/* PAGEBODY */}
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
})(withRouter(MyLoves))
