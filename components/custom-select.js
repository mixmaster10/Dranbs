import React from "react";
import {components} from "react-select";

export class SingleValue extends React.Component {
    render() {
        return (
            <components.SingleValue {...this.props}>
                <i className={this.props.data.icon} style={{marginRight: "5px"}}/>
                {this.props.data.label}
            </components.SingleValue>
        )
    }
}

export class Option extends React.Component {
    render() {
        return (
            <components.Option {...this.props}>
                <i className={this.props.data.icon} style={{marginRight: "5px"}}/>
                {this.props.data.label}
            </components.Option>
        )
    }
}

export const IndicatorSeparator = ({innerProps}) => {
    return <></>
}
