import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import {
  setAuth,
  setBrandGender,
  setBrandPeriod,
  setBrandSiteType,
  setSiteType,
} from "../../redux/actions";

class BrandFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <>
        <div className="navbar is-fixed-bottom filter-body filter" style={{height: '275px'}}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img src="/icons/slider.svg" />
            <p style={{ marginLeft: "7px", fontSize: "11px" }}>filters</p>
          </div>
          <div className="filter-item" style={{ marginTop: "20px", marginBottom: "25px" }}>
            <a
              onClick={() => this.props.setBrandGender(0)}
              className={`${this.props.gender === 0 ? "is-active" : ""}`}
            >
              all
            </a>
            <a
              onClick={() => this.props.setBrandGender(1)}
              className={`${this.props.gender === 1 ? "is-active" : ""}`}
            >
              women
            </a>
            <a
              onClick={() => this.props.setBrandGender(2)}
              className={`${this.props.gender === 2 ? "is-active" : ""}`}
            >
              men
            </a>
          </div>
          <div className="filter-item" style={{ marginBottom: "25px" }}>
            <a
              onClick={() => this.props.setBrandPeriod(-1)}
              className={`${this.props.period === -1 ? "is-active" : ""}`}
            >
              all
            </a>
            <a
              onClick={() => this.props.setBrandPeriod(1)}
              className={`${this.props.period === 1 ? "is-active" : ""}`}
            >
              today
            </a>
            <a
              onClick={() => this.props.setBrandPeriod(7)}
              className={`${this.props.period === 7 ? "is-active" : ""}`}
            >
              one week
            </a>
          </div>
          <div
            className="filter-item"
            style={{ marginBottom: "25px" }}
            onClick={() => this.props.onClose(false)}
          >
            <p style={{ fontSize: "20px", textAlign: "center" }}>X</p>
          </div>
        </div>
      </>
    );
  }
}

BrandFilter.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth.auth,
    siteType: state.homeFilter.siteType,
    brandSiteType: state.brandFilter.siteType,
    gender: state.brandFilter.gender,
    period: state.brandFilter.period,
  };
};

export default connect(mapStateToProps, {
  setAuth,
  setSiteType,
  setBrandSiteType,
  setBrandGender,
  setBrandPeriod,
})(withRouter(BrandFilter));
