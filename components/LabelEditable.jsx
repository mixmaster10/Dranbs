import React from "react";
import PropTypes from "prop-types";
import { EditOutlined, SaveOutlined } from "@material-ui/icons";

class LabelEditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      currentValue: "",
      inputWidth: 0,
    };
    this.inputRef = React.createRef();
    this.sizerRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      currentValue: this.props.value,
    });
    this.updateInputWidth();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        currentValue: this.props.value,
      });
    }
    this.updateInputWidth();
  }

  updateInputWidth = () => {
    let newInputWidth = this.sizerRef.current.scrollWidth + 2;
    if (newInputWidth !== this.state.inputWidth) {
      this.setState({
        inputWidth: newInputWidth,
      });
    }
  };

  saveDescription = () => {
    this.props.onChange(this.state.currentValue);
    this.setState({
      editable: false,
    });
  };

  handleEnterPressInput = (event) => {
    if (event.code === "Enter") {
      this.saveDescription();
    }
  };

  render() {
    const inputStyle = {
      boxSizing: "content-box",
      width: `${this.state.inputWidth}px`,
    };
    return (
      <div className={`editable ${this.props.className}`}>
        <div className="edit-flex">
          {this.state.editable ? (
            <input
              className="input-editable"
              autoFocus
              type="text"
              onKeyDown={this.handleEnterPressInput}
              value={this.state.currentValue}
              ref={this.inputRef}
              style={inputStyle}
              placeholder={this.props.emptyString}
              onChange={(event) => {
                this.setState({ currentValue: event.target.value });
              }}
            />
          ) : (
            <label className="label-editable">
              {this.state.currentValue
                ? this.state.currentValue
                : this.props.emptyString}
            </label>
          )}
          {this.state.editable ? (
            <SaveOutlined
              style={{ color: "#1CCF8F" }}
              onClick={() => this.saveDescription()}
            />
          ) : (
            <EditOutlined onClick={() => this.setState({ editable: true })} />
          )}

          <div
            style={{
              visibility: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "scroll",
              whiteSpace: "nowrap",
            }}
            ref={this.sizerRef}
          >
            {this.state.currentValue
              ? this.state.currentValue
              : this.props.emptyString}
          </div>
        </div>
      </div>
    );
  }
}

LabelEditable.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default LabelEditable;
