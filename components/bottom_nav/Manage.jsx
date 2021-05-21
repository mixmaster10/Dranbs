import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { setAuth, setSiteType } from "../../redux/actions";

class Manage extends React.Component {
  handleLogout = async () => {
    this.props.setAuth(false)
    await this.props.router.push('/')
  }

  render() {
    return (
      <>
        <div
          className="navbar is-fixed-bottom filter-body filter"
          style={{ height: "275px" }}>
          <div
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Link href={`/boards/${this.props.auth.user ? this.props.auth.user.username: ''}`}
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "15px",
                justifyContent: "center",
              }}>
              <a className="navbar-item">my boards</a>
            </Link>
            <Link href={`/settings`}
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "15px",
                justifyContent: "center",
              }}>
              <a className="navbar-item">my profile</a>
            </Link>
            <Link href={`/contact`}
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "15px",
                justifyContent: "center",
              }}>
              <a className="navbar-item">contact us</a>
            </Link>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "15px",
                marginTop: "5px",
                justifyContent: "center",
              }}
              onClick={this.handleLogout}>
              log out
            </div>
            <div
              className="filter-item"
              style={{ marginBottom: "15px" }}
              onClick={() => this.props.onClose(false)}>
              <p style={{ textAlign: "center", fontSize: "20px" }}>X</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Manage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth.auth,
  };
};

export default connect(mapStateToProps, {
  setAuth,
})(withRouter(Manage));
