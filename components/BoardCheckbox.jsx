import React from 'react'
import PropTypes from 'prop-types'

class BoardCheckbox extends React.Component {
    render() {
        return (
            <div className="field is-relative">
                <input className="is-checkradio is-black" type="checkbox" checked={this.props.checked} id={`checkbox${this.props.index}`}
                       onChange={() => {
                           this.props.onChange(this.props.board.id)
                       }} />
                <label htmlFor={`checkbox${this.props.index}`}>{this.props.board.name}</label>
                {this.props.checked && <span className="saved">saved</span>}
            </div>
        )
    }
}

BoardCheckbox.propTypes = {
    board: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired
}

export default BoardCheckbox
