import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { setAuth, setSiteType } from "../../redux/actions";

class Browse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const router = this.props.router
    return (
      <>
        <div className="navbar is-fixed-bottom filter-body filter" style={{ height: "275px"}}>
          <div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'center',
                marginBottom: "15px",
                marginTop: "20px",
              }}
              onClick={() => {
                this.props.setSiteType(1)
                router.push('/home')
              }}
            >
              new arrival
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'center',
                marginBottom: "15px",
              }}
              onClick={() => {
                this.props.setSiteType(2)
                router.push('/home')
              }}
            >
              sales
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'center',
                marginBottom: "15px",
              }}
              onClick={() => {
                router.push('/boards')
              }}
            >
              boards
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'center',
                marginBottom: "15px",
              }}
              onClick={() => {
                router.push('/my-loves')
              }}
            >
              <img src="/icons/favorite.svg" />
              <p style={{ marginLeft: "7px" }}>I love</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'center',
                marginBottom: "15px",
              }}
              onClick={() => {
                router.push('/my-following')
              }}
            >
              <img src="/icons/dashboard.svg" />
              <p style={{ marginLeft: "7px" }}>I follow</p>
            </div>
            <div
              className="filter-item"
              style={{ marginBottom: "15px" }}
              onClick={() => this.props.onClose(false)}
            >
              <p style={{ textAlign: "center", fontSize: "20px" }}>X</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Browse.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
      auth: state.auth.auth,
      siteType: state.homeFilter.siteType,
  }
}

export default connect(mapStateToProps, {
  setAuth,
  setSiteType,
})(withRouter(Browse))
