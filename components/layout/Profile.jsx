import React from 'react'
import PropTypes from 'prop-types'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setSiteType} from "../../redux/actions";
import Sticky from "react-stickynode";
import {Dashboard, Favorite} from "@material-ui/icons";
import BoardModal from "../BoardModal";
import TopNavCommon from "../TopNavCommon";

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
        }
    }

    render() {
        return (
            <>
                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
                    <header>
                        <TopNavCommon />
                    </header>
                    <section className="profile-heading">
                        {this.props.headIcon === 'favorite' && <Favorite style={{color: '#FF3366', fontSize: 22, marginRight: '8px'}} />}
                        {this.props.headIcon === 'dashboard' && <Dashboard style={{color: '#FA9805', fontSize: 22, marginRight: '8px'}} />}
                        <span>{this.props.headTitle}</span>
                    </section>
                </Sticky>
                {this.props.children}
                <BoardModal onToggleSaved={this.props.onToggleSaved} />
            </>
        )
    }
}

Profile.propTypes = {
    headTitle: PropTypes.string.isRequired,
    headIcon: PropTypes.string.isRequired,
    onToggleSaved: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
})(withRouter(Profile))
