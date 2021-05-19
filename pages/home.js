import React, {Component} from 'react'
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import HomeLayout from '../components/layout/HomeLayout'
import {getProducts} from "../utils/api";
import {connect} from "react-redux";
import {withRouter} from "next/router";

import styles from '../styles/Home.module.scss'
import Product from "../components/Product";
import {setAuth} from "../redux/actions";

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            width: '300px',
            fullyMounted: false,
            isLoadingData: false,
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
        if (this.props.siteType !== prevProps.siteType) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            this.props.toggleLoaded(false)
            await this.getInitialProducts()
        }
        if (this.props.exploreType !== prevProps.exploreType) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            this.props.toggleLoaded(false)
            await this.getInitialProducts()
        }
        if (this.props.gender !== prevProps.gender) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            this.props.toggleLoaded(false)
            await this.getInitialProducts()
        }
        if (this.props.period !== prevProps.period) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            this.props.toggleLoaded(false)
            await this.getInitialProducts()
        }
    }

    getInitialProducts = async () => {
        try {
            const response = await getProducts(this.props.auth.meta.token, 0, this.props.siteType, this.props.exploreType, this.props.gender, this.props.period)
            this.setState({
                data: response.data,
                dataPage: 1
            }, this.loadMoreProducts)
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/')
        }
        this.props.toggleLoaded(true)
    }

    loadMoreProducts = async () => {
        if (this.state.isLoadingData)
            return
        this.setState({isLoadingData: true}, this.mount)
        try {
            const response = await getProducts(this.props.auth.meta.token, this.state.dataPage, this.props.siteType, this.props.exploreType, this.props.gender, this.props.period)
            let data = response.data

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
            this.setState({fullyMounted: true}, this.handleResize)
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
            width = parentWidth
        } else if (browserWidth <= 1024) {
            width = (parentWidth - 130) / 3
        } else {
            width = (parentWidth - 115) / 6
        }

        this.setState({width})
    }

    handleToggleSaved = ({productId, saved}) => {
        let products = [...this.state.data]
        let index = this.state.data.findIndex(p => p.id === productId)
        let product = {...products[index]}
        product.saved = saved
        products[index] = product
        this.setState({
            data: products
        })
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

    render() {
        if (!this.props.loaded) {
            return <div id="page-loader" className="show-logo">
                <span className="loader-icon bullets-jump"><span/><span/><span/></span>
            </div>
        }

        return (
            <HomeLayout onToggleSaved={this.handleToggleSaved}>
                <div>

                    <div id="page-content">
                        <div id="hero-and-body">
                            {/* PAGEBODY */}
                            {this.props.loaded && this.state.data.length === 0 && this.state.fullyMounted && !this.props.exploreType &&
                            (<div className={styles.afterRegister}>
                                <p className="has-text-centered no-brand">you have no brands in <b>"my
                                    selection"</b> filters.</p>
                                <p className="has-text-centered follow-brand">
                                    To follow brands just <b>explore</b> and visit a<br/>
                                    brand page, then click on the follow button.
                                </p>
                            </div>)
                            }
                            <section id="page-body">
                                <div className="is-hidden-tablet" style={{height: '20px'}}/>
                                <div className="wrapper">

                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[{columns: 1, gutter: 20}, {
                                            mq: '769px',
                                            columns: 3,
                                            gutter: 20
                                        }, {mq: '1025px', columns: 6, gutter: 20}]}
                                        infiniteScroll={async () => {
                                            await this.loadMoreProducts()
                                        }}
                                        infiniteScrollDistance={400}
                                    >
                                        {this.state.data.map((product, i) => (
                                                <Product width={this.state.width} product={product} key={i}
                                                         onLoad={() => this.debounce()} isBrand={false}/>
                                            )
                                        )}
                                    </MasonryLayout>
                                    {/*</div>*/}
                                </div>
                                {/* END .wrapper */}
                            </section>
                            {/* PAGEBODY */}
                        </div>

                    </div>
                </div>
            </HomeLayout>

        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
        exploreType: state.homeFilter.exploreType,
        gender: state.homeFilter.gender,
        period: state.homeFilter.period
    }
}

export default connect(mapStateToProps, {
    setAuth
})(withRouter(HomePage))
