import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import {
    setExploreType,
    setGender,
    setPeriod,
  } from "../../redux/actions";

class HomeFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <>
        <div className="navbar is-fixed-bottom filter-body filter" style={{height: '275px'}}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img src="/icons/slider.svg" />
            <p style={{ marginLeft: "7px", fontSize: "11px" }}>filters</p>
          </div>
          <div className="filter-item" style={{ marginTop: "25px", marginBottom: "25px" }}>
            <a
              onClick={() => this.props.setExploreType(true)}
              className={`${this.props.exploreType ? "is-active" : ""}`}>
              explore
            </a>
            <a
              onClick={() => this.props.setExploreType(false)}
              className={`${!this.props.exploreType ? "is-active" : ""}`}>
              my selection
            </a>
          </div>
          <div className="filter-item" style={{ marginBottom: "25px" }}>
            <a
              onClick={() => this.props.setGender(0)}
              className={`${this.props.gender === 0 ? "is-active" : ""}`}>
              all
            </a>
            <a
              onClick={() => this.props.setGender(1)}
              className={`${this.props.gender === 1 ? "is-active" : ""}`}>
              women
            </a>
            <a
              onClick={() => this.props.setGender(2)}
              className={`${this.props.gender === 2 ? "is-active" : ""}`}>
              men
            </a>
          </div>
          <div className="filter-item" style={{ marginBottom: "25px" }}>
            <a
              onClick={() => this.props.setPeriod(-1)}
              className={`${this.props.period === -1 ? "is-active" : ""}`}>
              all
            </a>
            <a
              onClick={() => this.props.setPeriod(1)}
              className={`${this.props.period === 1 ? "is-active" : ""}`}>
              today
            </a>
            <a
              onClick={() => this.props.setPeriod(7)}
              className={`${this.props.period === 7 ? "is-active" : ""}`}>
              one week
            </a>
          </div>
          <div 
            className="filter-item" 
            onClick={() => this.props.onClose(false)}
            >
            <p style={{ fontSize: "20px", textAlign: "center" }}>X</p>
          </div>
        </div>
      </>
    );
  }
}

HomeFilter.propTypes = {
    onClose: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
      exploreType: state.homeFilter.exploreType,
      gender: state.homeFilter.gender,
      period: state.homeFilter.period,
    };
  };
  
  export default connect(mapStateToProps, {
    setExploreType,
    setGender,
    setPeriod,
  })(withRouter(HomeFilter));
