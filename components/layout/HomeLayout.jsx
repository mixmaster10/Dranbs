import React from "react";
import styles from "./layout.module.scss";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import {
  setAuth,
  setExploreType,
  setSiteType,
  setGender,
  setPeriod,
} from "../../redux/actions";
import Sticky from "react-stickynode";
import BoardModal from "../BoardModal";

import Filter from "../Filter/HomeFilter"
import Browse from "../bottom_nav/Browse"
import Manage from "../bottom_nav/Manage"
import BottomBar from "../bottom_nav/BottomBar"

import TopNav from "../TopNav";
import PropTypes from "prop-types";

class HomeLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stickyNav: true,

      isShowFilterButton: true,
      isShowFilter: false,
      isShowBrowse: false,
      isShowManage: false,
    };
  }

  handleFilterClose = (value) => {
    this.setState({
      isShowFilter: value, isShowFilterButton: true
    })
  }

  handleBrowseClose = (value) => {
    this.setState({
      isShowBrowse: value,
      isShowFilterButton: true
    })
  }

  handleManageClose = (value) => {
    this.setState({
      isShowManage: value,
      isShowFilterButton: true
    })
  }

  handleBottomBarSelect = (value) => {
    this.setState({isShowFilterButton: false, isShowFilter: false, isShowBrowse: false, isShowManage: false}, ()=>{

      if (value === 1) {
        this.props.setSiteType(1)
        this.props.router.push('/home')
        this.setState({isShowFilterButton:true})
      } else if (value === 2) {
        this.setState({
          isShowBrowse: true
        })
      } else if (value === 4) {
        this.setState({
          isShowManage: true
        })
      }
    })
  }

  render() {
    const siteType = this.props.siteType
    return (
      <>
        <div className="home-top-nav navbar is-fixed-top navbar-d-none mobile-top-bar">
          <div>
            {siteType == 1 ? 'new arrivals' : 'sale'}
          </div>
          {this.state.isShowFilterButton ? 
            <button 
              className="btn-filter" 
              style={{position:"absolute", left: 0, top: '203px'}}
              onClick={() => this.setState({isShowFilter: !this.state.isShowFilter, isShowFilterButton: false})}>
                  <img src="/icons/filter.svg" />
                  <p>Filter</p>
            </button>
          : null}
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
            <TopNav />
          </header>
          <section className="filter">
            <div className="is-flex">
              <div className={styles.filterTitle}>
                <img src="/icons/slider.svg" />
                filters
              </div>
              <div className="filter-item">
                <a
                  onClick={() => this.props.setExploreType(true)}
                  className={`${this.props.exploreType ? "is-active" : ""}`}
                >
                  explore
                </a>
                <a
                  onClick={() => this.props.setExploreType(false)}
                  className={`${!this.props.exploreType ? "is-active" : ""}`}
                >
                  my selection
                </a>
              </div>
              <div className="filter-item">
                <a
                  onClick={() => this.props.setGender(0)}
                  className={`${this.props.gender === 0 ? "is-active" : ""}`}
                >
                  all
                </a>
                <a
                  onClick={() => this.props.setGender(1)}
                  className={`${this.props.gender === 1 ? "is-active" : ""}`}
                >
                  women
                </a>
                <a
                  onClick={() => this.props.setGender(2)}
                  className={`${this.props.gender === 2 ? "is-active" : ""}`}
                >
                  men
                </a>
              </div>
              <div className="filter-item">
                <a
                  onClick={() => this.props.setPeriod(-1)}
                  className={`${this.props.period === -1 ? "is-active" : ""}`}
                >
                  all
                </a>
                <a
                  onClick={() => this.props.setPeriod(1)}
                  className={`${this.props.period === 1 ? "is-active" : ""}`}
                >
                  today
                </a>
                <a
                  onClick={() => this.props.setPeriod(7)}
                  className={`${this.props.period === 7 ? "is-active" : ""}`}
                >
                  one week
                </a>
              </div>
            </div>
          </section>
        </Sticky>

        <div className="home-body">
            {this.props.children}
        </div>
    
        {this.state.isShowFilter ? <Filter onClose={this.handleFilterClose}/> : null}
        {this.state.isShowBrowse ? <Browse onClose={this.handleBrowseClose}/> : null}
        {this.state.isShowManage ? <Manage onClose={this.handleManageClose}/> : null}
        <BottomBar onSelect={this.handleBottomBarSelect}/>
  
        <BoardModal onToggleSaved={this.props.onToggleSaved} />
      </>
    );
  }
}

HomeLayout.propTypes = {
  onToggleSaved: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth.auth,
    siteType: state.homeFilter.siteType,
    exploreType: state.homeFilter.exploreType,
    gender: state.homeFilter.gender,
    period: state.homeFilter.period,
  };
};

export default connect(mapStateToProps, {
  setAuth,
  setExploreType,
  setSiteType,
  setGender,
  setPeriod,
})(withRouter(HomeLayout));
