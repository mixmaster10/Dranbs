import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { setAuth, setSiteType } from "../../redux/actions";

class BottomBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <>
        <nav className="navbar is-link is-fixed-bottom navbar-d-none mobile-bottom-bar" role="navigation">
          <div className="navbar-brand nav-brand-style">
            <a className="navbar-item is-expanded is-block has-text-centered" onClick={() => this.props.onSelect(1)}>
              <img src="/icons/home.svg" />
              <p>home</p>
            </a>
            <a className="navbar-item is-expanded is-block has-text-centered is-align-items-center" onClick={() => this.props.onSelect(2)}>
              <img src="/icons/visibility.svg" />
              <p>browse</p>
            </a>
            <a className="navbar-item is-expanded is-block has-text-centered" onClick={() => this.props.onSelect(3)}>
              <img src="/icons/search.svg" />
              <p>search</p>
            </a>
            <a className="navbar-item is-expanded is-block has-text-centered" onClick={() => this.props.onSelect(4)}>
              <img src="/icons/settings.svg" />
              <p>manage</p>
            </a>
          </div>
        </nav>
      </>
    );
  }
}

BottomBar.propTypes = {
  onSelect: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps, {
})(withRouter(BottomBar));
