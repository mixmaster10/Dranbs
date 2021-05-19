import React from 'react'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setExploreType, setGender, setPeriod} from "../../redux/actions";
import Sticky from "react-stickynode";
import BoardModal from "../BoardModal";
import TopNavCommon from "../TopNavCommon";

class Default extends React.Component {
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
                </Sticky>
                {this.props.children}
                <BoardModal/>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        exploreType: state.homeFilter.exploreType,
        gender: state.homeFilter.gender,
        period: state.homeFilter.period
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setExploreType,
    setGender,
    setPeriod
})(withRouter(Default))
