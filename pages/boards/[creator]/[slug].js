import React from 'react'
import {getProductsByBoard} from "../../../utils/api";
import MasonryLayout from "react-masonry-layout";
import {connect} from "react-redux";
import {setAuth} from "../../../redux/actions";
import {withRouter} from "next/router";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import Product from "../../../components/Product";
import BoardLayout from "../../../components/layout/BoardLayout";
import BoardHome from '../../../components/layout/BoardHome';

const repackDebounced = AwesomeDebouncePromise(() => true, 50);

class BoardsById extends React.Component {
    static async getInitialProps(ctx) {
        const {query} = ctx
        return {
            slug: query.slug,
            creator: query.creator
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            width: '300px',
            fullyMounted: false,
            isLoadingData: false,
            hasMore: true,
        }
    }

    getInitialProducts = async () => {
        try {
            const response = await getProductsByBoard(this.props.auth.meta.token, this.props.creator, this.props.slug, 0)
            if (response.data.length === 0) {
                this.setState({
                    hasMore: false
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
            }, this.loadMoreProducts)
            this.props.toggleLoaded(true)
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/login')
        }
    }

    loadMoreProducts = async () => {
        if (this.state.isLoadingData)
            return
        if (!this.state.hasMore)
            return
        this.setState({isLoadingData: true}, this.mount)
        try {
            const response = await getProductsByBoard(this.props.auth.meta.token, this.props.creator, this.props.slug, this.state.dataPage)
            let data = response.data
            if (data.length === 0) {
                this.setState({
                    hasMore: false
                })
                this.props.toggleLoaded(true)
                return
            }

            this.setState({
                data: this.state.data.concat(data),
                dataPage: this.state.dataPage + 1,
                isLoadingData: false
            }, this.mount)
            this.props.toggleLoaded(true)
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/login')
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

    render() {
        if (!this.props.loaded) {
            return (
                <div id="page-loader" className="show-logo">
                    <span className="loader-icon bullets-jump"><span/><span/><span/></span>
                </div>
            )
        }
        return (
            <BoardHome username={this.props.creator} slug={this.props.slug}
                    isMine={this.props.creator === this.props.auth.user.username}
                    onToggleSaved={this.handleToggleSaved}>
                <div className='board-detail-body'>
                    <div id="page-content">
                        <div id="hero-and-body">
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
                                        {this.state.data.map((product, i) =>
                                            <Product
                                                width={this.state.width}
                                                product={product} key={i}
                                                onLoad={() => this.debounce()}
                                                isBrand={false}
                                            />)}
                                    </MasonryLayout>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </BoardHome>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {
    setAuth
})(withRouter(BoardsById))

