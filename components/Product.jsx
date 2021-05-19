import React from 'react'
import PropTypes from 'prop-types'
import config from "../config";
import styles from "./product.module.scss";
import Link from "next/link";
import {Dashboard, DashboardOutlined, Favorite, FavoriteBorderOutlined} from "@material-ui/icons";
import {toggleLoveProduct} from "../utils/api";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setModalActive, setProductIdForBoard} from "../redux/actions";

class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLove: false
        }
    }

    componentDidMount() {
        this.setState({
            isLove: this.props.product.liked
        })
    }

    handleLoveClick = async () => {
        try {
            const data = await toggleLoveProduct(this.props.auth.meta.token, this.props.product.id)
            this.setState({
                isLove: data.is_love
            })
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push("/login")
        }
    }

    saveToBoard = () => {
        document.getElementsByTagName('html')[0].style.overflowY = 'hidden'
        this.props.setProductIdForBoard(this.props.product.id)
        this.props.setModalActive(true)
    }

    render() {
        const product = this.props.product

        return (
            <div className="blog-media" style={{
                width: this.props.width
            }}>
                <a href={product.product_link} target={"_blank"}
                   className="thumb-hover scale">
                    <img
                        onLoad={this.props.onLoad}
                        style={{objectFit: 'contain', width: '100%'}}
                        src={`${config.domain}/images/${product.image_filename}`}
                    />
                    <span className={styles.shopNow}>shop now</span>
                </a>
                <div className="blog-info">
                    <div className="is-flex is-justify-content-center mb-2">
                        <div className={styles.action}>
                            <button onClick={this.handleLoveClick}>
                                {this.state.isLove ? (
                                    <>
                                        <Favorite style={{color: '#FF3366', fontSize: 24}} />
                                        <br/>
                                        <span>remove</span>
                                    </>
                                ) : (
                                    <>
                                        <FavoriteBorderOutlined style={{fontSize: 24}} />
                                        <br/>
                                        <span>love</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className={styles.action}>
                            <button onClick={() => this.saveToBoard()}>
                                {product.saved ? (
                                    <>
                                        <Dashboard style={{fontSize: 24, color: '#FA9805'}} /><br/>
                                        <span>manage</span>
                                    </>
                                ) : (
                                    <>
                                        <DashboardOutlined style={{fontSize: 24}} /><br/>
                                        <span>+ board</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <Link href={product.product_link}>
                        <a target="_blank" className={styles.productDetail}>
                            <p className={styles.productTitle}>{product.title}</p>
                            {
                                product.sale_price ? (
                                    <p className={styles.price}>
                                        <span className={styles.salePrice}>{product.sale_price}</span>
                                        <span className={styles.oldPrice}>{product.price}</span>
                                    </p>
                                ) : (
                                    <p className={styles.price}>{product.price}</p>
                                )
                            }
                        </a>
                    </Link>
                    {!this.props.isBrand && (
                        <Link href={`/brand/${product.name}`}>
                            <a>
                                <p className={styles.brandName}>{product.display_name}</p>
                            </a>
                        </Link>
                    )}
                </div>
            </div>
        )
    }
}

Product.propTypes = {
    width: PropTypes.any.isRequired,
    product: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    isBrand: PropTypes.bool.isRequired,
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setModalActive,
    setProductIdForBoard,
})(withRouter(Product))
