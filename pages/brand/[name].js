import React, {Component} from 'react'
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import Brand from '../../components/layout/Brand'
import {getBrandInfo, getProductsByBrand} from "../../utils/api";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import Product from "../../components/Product";

class BrandPage extends Component {
    static async getInitialProps(ctx) {
        const {query} = ctx
        return {brandName: query.name}
    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            hasMore: true,
            width: '300px',
            height: '400px',
            filterBy: 1,
            stickyNav: true,
            fullyMounted: false,
            displayName: ''
        }
    }

    async componentDidMount() {
        this.props.toggleLoaded(false)
        const data = await getBrandInfo(this.props.auth.meta.token, this.props.brandName)
        const {display_name, followers, genders, is_following} = data
        this.setState({
            displayName: display_name,
        })
        await this.getInitialProducts()
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
        if (this.props.period !== prevProps.period) {
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

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    getInitialProducts = async () => {
        const brandName = this.props.brandName
        if (!brandName) {
            return;
        }
        try {
            const response = await await getProductsByBrand(this.props.auth.meta.token, brandName, 0, this.props.siteType, this.props.gender, this.props.period)
            this.setState({
                data: response.data,
                dataPage: 1
            }, this.loadMoreProducts)
        } catch (e) {
            console.error(e)
            await this.props.router.push('/login')
        }
        this.props.toggleLoaded(true)
    }

    loadMoreProducts = async () => {
        if (this.state.isLoadingData)
            return
        this.setState({isLoadingData: true}, this.mount)
        try {
            const brandName = this.props.brandName
            if (!brandName) {
                return;
            }
            const response = await getProductsByBrand(this.props.auth.meta.token, brandName, this.state.dataPage, this.props.siteType, this.props.gender, this.props.period)
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
        const brandName = this.props.brandName
        if (!this.props.loaded) {
            return <div id="page-loader" className="show-logo">
                <span className="loader-icon bullets-jump"><span/><span/><span/></span>
            </div>
        }
        return (
            <Brand brandName={brandName} displayName={this.state.displayName} onToggleSaved={this.handleToggleSaved}>
                <div>
                    <div id="page-content">

                        <div id="hero-and-body">
                            {/* PAGEBODY */}
                            <section id="page-body" className="brand-body">
                                {/*<div className="spacer-small" />*/}
                                <div className="wrapper">
                                    {this.props.loaded && (this.state.data.length === 0 && this.state.filterBy === 2) &&
                                    <div>This Brand has no sale styles for the moment.</div>}
                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[{columns: 1, gutter: 20}, {
                                            mq: '769px',
                                            columns: 3,
                                            gutter: 20
                                        }, {mq: '1025px', columns: 6, gutter: 20}]}
                                        infiniteScroll={() => {
                                            this.loadMoreProducts()
                                        }}
                                        infiniteScrollDistance={400}
                                    >
                                        {this.state.data.map((product, i) => <Product width={this.state.width} product={product} key={i} onLoad={() => this.debounce()} isBrand={true} />)}
                                    </MasonryLayout>
                                </div>
                                {/* END .wrapper */}
                            </section>
                            {/* PAGEBODY */}
                        </div>

                    </div>
                </div>


            </Brand>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.brandFilter.siteType,
        period: state.brandFilter.period,
        gender: state.brandFilter.gender
    }
}

export default connect(mapStateToProps)(withRouter(BrandPage))
