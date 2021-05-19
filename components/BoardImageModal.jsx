import React from 'react'
import PropTypes from 'prop-types'
import styles from './modal.module.scss'
import config from "../config";
import {uploadBoardImage} from "../utils/api";
import {connect} from "react-redux";
import {setAuth} from "../redux/actions";
import {withRouter} from "next/router";

class BoardImageModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageUrl: null,
            prevUrl: null,
            file: null,
            uploadPercent: 0,
            error: null
        }

        this.fileRef = React.createRef()
    }

    handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                file: event.target.files[0]
            }, () => {
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({
                        imageUrl: e.target.result
                    })
                }
                reader.readAsDataURL(event.target.files[0])
            })
        }
    }

    handleReset = () => {
        if (this.state.prevUrl) {
            this.setState({
                imageUrl: this.state.prevUrl,
                error: null
            })
        }
    }

    handleUploadProgress = (progressEvent) => {
        console.log(progressEvent)
        let percent = progressEvent.loaded / progressEvent.total * 100
        this.setState({
            uploadPercent: percent
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.state.file) {
            let formData = new FormData()
            formData.append('file', this.state.file)
            try {
                await uploadBoardImage(this.props.auth.meta.token, this.props.username, this.props.slug, formData, this.handleUploadProgress)
                this.props.onClose()
            } catch (e) {
                this.setState({
                    error: e.response.data.message
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isActive !== prevProps.isActive && this.props.isActive) {
            if (this.props.imageFilename) {
                this.setState({
                    imageUrl: `${config.domain}/images/${this.props.imageFilename}`,
                    prevUrl: `${config.domain}/images/${this.props.imageFilename}`,
                })
            }
        }
    }

    render() {
        return (
            <div className={`modal ${this.props.isActive ? 'is-active': ''}`}>
                <div className="modal-background" onClick={this.props.onClose} />
                <div className="modal-content">
                    <div className={`box ${styles.box}`}>
                        <div className="columns">
                            <div className="column is-one-quarter">
                                <img src={this.state.imageUrl} className={styles.image} />
                            </div>
                            <div className="column">
                                <form onSubmit={this.handleSubmit}>
                                    <h4 className={styles.head}>Change board image</h4>
                                    <div className="field">
                                        <label className={styles.upload}>
                                            <input type="file" hidden ref={this.fileRef} onChange={this.handleFileChange} accept="image/*" />
                                            upload image
                                        </label>
                                        <p className="help">
                                            *Image max size 1MB
                                        </p>
                                        {this.state.error && (
                                            <p className="help is-danger">
                                                {this.state.error}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <button className={styles.button} type="reset" onClick={this.handleReset}>
                                            reset
                                        </button>
                                    </div>
                                    {
                                        this.state.uploadPercent > 0 && this.state.uploadPercent < 100 && (
                                            <div>
                                                <progress className="progress is-info" value={this.state.uploadPercent} max="100"/>
                                            </div>
                                        )
                                    }
                                    <div className="has-text-right">
                                        <button
                                            type="button"
                                            className={styles.button}
                                            onClick={() => {
                                                this.fileRef.current.value = null
                                                this.setState({
                                                    imageUrl: null,
                                                    error: null
                                                }, () => {
                                                    this.props.onClose()
                                                })
                                            }}
                                        >
                                            cancel
                                        </button>
                                        <button className={styles.save}>save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

BoardImageModal.propTypes = {
    imageFilename: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    slug: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
    }
}

export default connect(mapStateToProps, {
    setAuth,
})(withRouter(BoardImageModal))
