import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import {
  setAuth,
  setBrandGender,
  setBrandPeriod,
  setBrandSiteType,
  setSiteType,
} from "../../redux/actions";
import Sticky from "react-stickynode";
import { getBrandInfo, toggleFollowBrand } from "../../utils/api";
import BoardModal from "../BoardModal";

import Filter from "../Filter/BrandFilter";
import Browse from "../bottom_nav/Browse";
import Manage from "../bottom_nav/Manage";
import BottomBar from "../bottom_nav/BottomBar";

import PropTypes from "prop-types";
import TopNavCommon from "../TopNavCommon";
import { SportsRugbySharp, TranslateSharp } from "@material-ui/icons";

class Brand extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stickyNav: true,
      followers: 0,
      is_following: false,
      genders: 1,

      isShowFilterButton: true,
      isShowFilter: false,
      isShowBrowse: false,
      isShowManage: false,

      scrollDirection: "scroll up",

      threshold: 0,
      isTicking: false,
      lastScrollY: window.pageYOffset,
    };
  }

  async componentDidMount() {
    try {
      const data = await getBrandInfo(
        this.props.auth.meta.token,
        this.props.brandName
      );
      this.setState({
        followers: data.followers,
        is_following: data.is_following,
        genders: data.genders,
      });

      window.addEventListener("scroll", this.onScroll);
    } catch (e) {
      this.props.setAuth(false);
      await this.props.router.push("/login");
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  updateScrollDir = () => {
    const scrollY = window.pageYOffset;

    if (Math.abs(scrollY - this.state.lastScrollY) < this.state.threshold) {
      this.setState({ isTicking: false });
      return;
    }

    this.handleScrollDownUp(
      scrollY > this.state.lastScrollY ? "scroll down" : "scroll up"
    );
    this.setState({ lastScrollY: scrollY > 0 ? scrollY : 0 });
    this.setState({ isTicking: false });
  };

  onScroll = () => {
    if (!this.state.isTicking) {
      window.requestAnimationFrame(this.updateScrollDir);
      this.setState({ isTicking: true });
    }
  };

  handleScrollDownUp(scrollDirection) {
    if (scrollDirection !== this.state.scrollDirection) {
      console.log("-------------------", scrollDirection);
      this.setState({ scrollDirection: scrollDirection });
    }
  }

  toggleFollow = async (brandName) => {
    try {
      const data = await toggleFollowBrand(
        this.props.auth.meta.token,
        brandName
      );
      this.setState({
        followers: data.followers,
        is_following: data.is_following,
      });
    } catch (e) {
      this.props.setAuth(false);
      await this.props.router.push("/login");
    }
  };

  handleFilterClose = (value) => {
    this.setState({
      isShowFilter: value,
      isShowFilterButton: true,
    });
  };

  handleBrowseClose = (value) => {
    this.setState({
      isShowBrowse: value,
    });
  };

  handleManageClose = (value) => {
    this.setState({
      isShowManage: value,
    });
  };

  handleBottomBarSelect = (value) => {
    this.setState(
      {
        isShowFilterButton: false,
        isShowFilter: false,
        isShowBrowse: false,
        isShowManage: false,
      },
      () => {
        if (value === 1) {
          this.props.setSiteType(1);
          this.props.router.push("/home");
          this.setState({ isShowFilterButton: true });
        } else if (value === 2) {
          this.setState({
            isShowBrowse: true,
          });
        } else if (value === 4) {
          this.setState({
            isShowManage: true,
          });
        }
      }
    );
  };

  render() {
    return (
      <>
        {/* Top Bar */}
        <div className="navbar is-fixed-top is-transparent navbar-d-none">
          <div className="mobile-top-bar">
            <button
              className="go-back"
              onClick={() => this.props.router.back()}>
              {"<-"}
            </button>
            {this.props.brandName}
          </div>
          {/* Follow Bar */}
          <div className={this.state.scrollDirection === "scroll down" ? "scroll-down" : "scroll-up"}>
            <div className="brand-top-bar filter">
              <div className="filter-item">
                <a
                  onClick={() => this.props.setBrandSiteType(1)}
                  className={`${
                    this.props.brandSiteType === 1 ? "is-active" : ""
                  }`}
                >
                  new arrivals
                </a>
                <a
                  onClick={() => this.props.setBrandSiteType(2)}
                  className={`${
                    this.props.brandSiteType === 2 ? "is-active" : ""
                  }`}
                >
                  sale
                </a>
              </div>
              <div className="filter-item">
                <button
                  className={this.state.is_following ? "unfollow" : "follow"}
                  onClick={() => this.toggleFollow(this.props.brandName)}>
                  {this.state.is_following ? "unfollow" : "follow"}
                </button>
              </div>
              <div className="filter-item">
                {this.state.followers} followers
              </div>
            </div>
          </div>
          {/* Filter Button */}
          {this.state.isShowFilterButton ? (
            <button
              style={{position:"absolute", left: 0, top: '203px'}}
              className="btn-filter"
              onClick={() =>
                this.setState({
                  isShowFilter: !this.state.isShowFilter,
                  isShowFilterButton: false,
                })
              }
            >
              <img src="/icons/filter.svg" />
              <p>Filter</p>
            </button>
          ) : null}
        </div>

        <Sticky
          enabled={this.state.stickyNav}
          top={0}
          bottomBoundary={0}
          innerZ={1500}
          activeClass={"sticky-active"}
          releasedClass={"sticky-released"}
        >
          <header>
            <TopNavCommon />
          </header>
          <section className="filter">
            <div className="brand-name">
              <button
                className="go-back"
                onClick={() => this.props.router.back()}
              >
                {"<-"}
              </button>
              <span>{this.props.displayName}</span>
            </div>
            <div className="is-flex is-align-items-center">
              <div className="filter-item">
                <a
                  onClick={() => this.props.setBrandSiteType(1)}
                  className={`${
                    this.props.brandSiteType === 1 ? "is-active" : ""
                  }`}
                >
                  new arrivals
                </a>
                <a
                  onClick={() => this.props.setBrandSiteType(2)}
                  className={`${
                    this.props.brandSiteType === 2 ? "is-active" : ""
                  }`}
                >
                  sale
                </a>
              </div>
              <div className="filter-item">
                <button
                  className={this.state.is_following ? "unfollow" : "follow"}
                  onClick={() => this.toggleFollow(this.props.brandName)}
                >
                  {this.state.is_following ? "unfollow" : "follow"}
                </button>
              </div>
              <div className="filter-item">
                {this.state.followers} followers
              </div>
              {this.state.genders === 2 && (
                <div className="filter-item">
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
              )}
              <div className="filter-item">
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
            </div>
          </section>
        </Sticky>

        <div className="brand-body">{this.props.children}</div>

        {this.state.isShowFilter ? (
          <Filter onClose={this.handleFilterClose} />
        ) : null}
        {this.state.isShowBrowse ? (
          <Browse onClose={this.handleBrowseClose} />
        ) : null}
        {this.state.isShowManage ? (
          <Manage onClose={this.handleManageClose} />
        ) : null}
        <BottomBar onSelect={this.handleBottomBarSelect} />

        <BoardModal onToggleSaved={this.props.onToggleSaved} />
      </>
    );
  }
}

Brand.propTypes = {
  displayName: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
  onToggleSaved: PropTypes.func.isRequired,
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
})(withRouter(Brand));
