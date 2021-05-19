import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth} from "../../redux/actions";
import Sticky from "react-stickynode";
import BoardModal from "../BoardModal";
import {changeBoardInfo, deleteBoard, getBoardInfo, toggleFollowBoard} from "../../utils/api";
import Select from "react-select";
import {IndicatorSeparator, SingleValue, Option} from "../custom-select";
import BoardImageModal from "../BoardImageModal";
import LabelEditable from "../LabelEditable";
import TopNavCommon from "../TopNavCommon";

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        top: '-7px',
        padding: 0,
        borderRadius: 0,
        fontSize: '14px'
    }),
    menuList: (provided, state) => ({
        ...provided,
        padding: 0,
    }),
    control: (provided) => ({
        ...provided,
        border: 'unset',
        borderRadius: 0,
        fontSize: '14px'
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'black'
    }),
}

class BoardLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
            followers: 0,
            isFollowing: false,
            description: '',
            optionIndex: 1,
            imageFilename: null,
            isImageModalActive: false,
            name: '',
            prevName: ''
        }
    }

    options = [
        {value: 0, label: 'Private', icon: 'far fa-lock-alt',},
        {value: 1, label: 'Public', icon: 'far fa-globe-americas'},
    ]

    async componentDidMount() {
        try {
            const data = await getBoardInfo(this.props.auth.meta.token, this.props.username, this.props.slug)
            this.setState({
                followers: data.followers,
                isFollowing: data.is_following,
                description: data.description,
                name: data.name,
                optionIndex: data.type,
                imageFilename: data.image_filename,
                prevName: data.name
            })
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push("/login")
        }
    }

    handleToggleFollow = async () => {
        try {
            const data = await toggleFollowBoard(this.props.auth.meta.token, this.props.username, this.props.slug)
            this.setState({
                followers: data.followers,
                isFollowing: data.is_following
            })
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/login')
        }
    }

    showImageModal = () => {
        this.setState({
            isImageModalActive: true
        })
    }

    closeImageModal = () => {
        document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
        this.setState({
            isImageModalActive: false
        })
    }

    handleOptionChange = async (newOption) => {
        try {
            await changeBoardInfo(this.props.auth.meta.token, this.props.username, this.props.slug, {
                type: newOption.value
            })
            this.setState({
                optionIndex: newOption.value
            })
        } catch (e) {
            console.error(e)
        }
    }

    handleDeleteClicked = async () => {
        let r = confirm('Are you sure to delete this board?')
        if (r) {
            try {
                await deleteBoard(this.props.auth.meta.token, this.props.username, this.props.slug)
                await this.props.router.push(`/boards/${this.props.username}`)
            } catch (e) {
                console.error(e)
            }
        }
    }

    handleBoardNameChange = async (value) => {
        try {
            this.setState({
                name: value
            })
            await changeBoardInfo(this.props.auth.meta.token, this.props.username, this.props.slug, {
                name: value
            })
        } catch (e) {
            alert(e.response.data.message)
            this.setState({
                name: this.state.prevName
            })
        }
    }

    handleBoardDescriptionChange = async (value) => {
        try {
            this.setState({
                description: value
            })
            await changeBoardInfo(this.props.auth.meta.token, this.props.username, this.props.slug, {
                description: value
            })
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <>
                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
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
                                    <LabelEditable className="head" value={this.state.name}
                                                   onChange={this.handleBoardNameChange}/>
                                ) : (
                                    <a>{this.state.name}</a>
                                )}
                            </li>
                        </ul>
                        <>
                            {this.props.isMine ? (
                                <LabelEditable className="desc"
                                               value={this.state.description}
                                               emptyString={"add a description"}
                                               onChange={this.handleBoardDescriptionChange}/>
                            ) : (
                                <p>{this.state.description}</p>
                            )}
                        </>
                        <div className="follow-piece">
                            {!this.props.isMine && (
                                <button
                                    className={this.state.isFollowing ? 'unfollow' : 'follow'}
                                    onClick={this.handleToggleFollow}
                                >
                                    {this.state.isFollowing ? 'unfollow' : 'follow'}
                                </button>
                            )}
                            <span className="followers">{this.state.followers} followers</span>
                            {this.props.isMine && (
                                <>
                                    <button
                                        className="hidden-sticky-active"
                                        onClick={() => {
                                            document.getElementsByTagName('html')[0].style.overflowY = 'hidden'
                                            this.showImageModal()
                                        }}
                                    >
                                        Change board image
                                    </button>
                                    <div className="hidden-sticky-active"
                                         style={{display: 'inline-block', width: '120px'}}>
                                        <Select
                                            options={this.options}
                                            value={this.options[this.state.optionIndex]}
                                            styles={customStyles}
                                            components={{Option, SingleValue, IndicatorSeparator}}
                                            onChange={this.handleOptionChange}
                                        />
                                    </div>
                                    <button onClick={this.handleDeleteClicked}>delete board</button>
                                </>
                            )}
                        </div>
                    </section>
                </Sticky>
                {this.props.children}
                <BoardModal onToggleSaved={this.props.onToggleSaved}/>
                {this.state.imageFilename && (
                    <BoardImageModal
                        imageFilename={this.state.imageFilename}
                        isActive={this.state.isImageModalActive}
                        slug={this.props.slug}
                        username={this.props.username}
                        onClose={() => this.closeImageModal()}
                    />)}
            </>
        )
    }
}

BoardLayout.propTypes = {
    isMine: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    onToggleSaved: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {
    setAuth,
})(withRouter(BoardLayout))
