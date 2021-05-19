import React from 'react'
import {connect} from "react-redux";
import {setModalActive} from "../redux/actions";
import Select, {components} from "react-select";
import {createBoard, getBoards, toggleProductSaved} from "../utils/api";
import BoardCheckbox from "./BoardCheckbox";

import {IndicatorSeparator, SingleValue, Option} from "./custom-select";
import PropTypes from "prop-types";

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        top: '-9px',
        padding: 0,
        borderRadius: 0
    }),
    menuList: (provided, state) => ({
        ...provided,
        padding: 0,
    }),
    control: (provided) => ({
        ...provided,
        border: 'unset',
        borderBottom: 'solid 1px black',
        borderRadius: 0,
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'black'
    }),
}

class BoardModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayForm: false,
            boardName: '',
            boardType: 1,
            boards: [],
            error: null
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isModalActive !== prevProps.isModalActive && this.props.isModalActive) {
            const response = await getBoards(this.props.auth.meta.token, '', this.props.productId)
            this.setState({
                boards: response.data
            })
        }
    }

    options = [
        {value: 1, label: 'Public', icon: 'far fa-globe-americas'},
        {value: 0, label: 'Private', icon: 'far fa-lock-alt'},
    ]

    showNewBoardForm = () => {
        this.setState({
            displayForm: true
        })
    }

    closeModal = () => {
        let savedBoards = this.state.boards.filter(b => b.saved)
        let saved = savedBoards.length > 0
        this.props.onToggleSaved({
            productId: this.props.productId,
            saved: saved
        })
        document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
        this.props.setModalActive(false)
    }

    handleBackgroundClick = () => {
        this.closeModal()
    }

    handleOptionChange = (newOption) => {
        this.setState({
            boardType: newOption.value
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const data = await createBoard(this.props.auth.meta.token, {
                board_name: this.state.boardName,
                board_type: this.state.boardType,
                product_id: this.props.productId
            })
            let boards = [...this.state.boards]
            let board = data.board
            board['saved'] = data.saved
            boards.push(board)
            this.setState({
                boards: boards,
                boardName: '',
                displayForm: false
            }, () => {
                this.closeModal()
            })
        } catch (e) {
            console.error(e)
            this.setState({
                error: e.response.data
            })
        }
    }

    handleCheckboxChange = async (boardId) => {
        try {
            const data = await toggleProductSaved(this.props.auth.meta.token, {
                product: this.props.productId,
                board: boardId
            })
            let index = this.state.boards.findIndex(b => b.id === boardId)
            let boards = [...this.state.boards];
            let board = {...boards[index]}
            board.saved = data.saved
            boards[index] = board
            this.setState({boards}, () => {
                let savedBoards = this.state.boards.filter(b => b.saved)
                let saved = savedBoards.length > 0
                this.props.onToggleSaved({
                    productId: this.props.productId,
                    saved: saved
                })
            })
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <div className={`modal ${this.props.isModalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={this.handleBackgroundClick}/>
                <div className="modal-content" style={{width: '320px'}}>
                    <div className="create-theme">
                        <header className="create-theme-head">
                            <p>
                                Save to
                                <button onClick={() => {
                                    this.closeModal()
                                }}>X</button>
                            </p>
                        </header>
                        <div className="create-theme-body">
                            <div className="board-list">
                                {this.state.boards.map((board, index) => (
                                    // <BoardCheckbox
                                    //     board={board} key={`${index}_${board.saved}`}
                                    //     index={index}
                                    //     productId={this.props.productId}
                                    //     token={this.props.auth.meta.token}
                                    //     checked={board.saved}
                                    //     onChange={this.handleCheckboxChange}/>
                                    <BoardCheckbox
                                        board={board} key={`${index}_${board.saved}`}
                                        index={index}
                                        checked={board.saved}
                                        onChange={this.handleCheckboxChange}/>
                                ))}
                            </div>
                        </div>
                        <footer className="create-theme-foot">
                            {
                                !this.state.displayForm &&
                                <button className="button show-form" onClick={() => this.showNewBoardForm()}>+ create
                                    new board</button>
                            }
                            {
                                this.state.displayForm && (
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="field">
                                            <label className="label">Board name</label>
                                            <input
                                                type="text" className="input"
                                                value={this.state.boardName}
                                                onChange={(event) => this.setState({boardName: event.target.value})}
                                                placeholder="Enter the name here"/>
                                            {this.state.error && this.state.error.board_name && (
                                                this.state.error.board_name.map((message, index) => (
                                                    <p className="help is-danger" key={index}>
                                                        {message}
                                                    </p>
                                                ))
                                            )}
                                        </div>
                                        <div className="field">
                                            <label className="label">Confidentiality</label>
                                            <Select
                                                options={this.options}
                                                defaultValue={this.options[0]}
                                                styles={customStyles}
                                                components={{Option, SingleValue, IndicatorSeparator}}
                                                onChange={this.handleOptionChange}
                                            />
                                        </div>
                                        <div className="field has-text-right">
                                            <button className="button create-board">create</button>
                                        </div>
                                    </form>
                                )
                            }
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

BoardModal.propTypes = {
    onToggleSaved: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        isModalActive: state.boardModal.isActive,
        productId: state.boardModal.productId
    }
}

export default connect(mapStateToProps, {
    setModalActive
})(BoardModal)
