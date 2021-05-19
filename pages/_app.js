import React from 'react'
import App from "next/app";
import Head from "next/head";
import Router from 'next/router'
import * as gtag from '../helpers/gtag'

import '../styles/globals.scss'
import {Provider} from "react-redux";
import store from "../redux/store";

Router.events.on('routeChangeComplete', url => gtag.pageview(url))

class MyApp extends App {
    state = {loaded: false}

    toggleLoaded = (neww) => {
        this.setState({loaded: neww})
    }

    render() {
        const {Component, pageProps} = this.props

        return (
            <Provider store={store}>
                <Head>
                    <meta name="viewport"
                          content="height=device-height,width=device-width, initial-scale=1.0, user-scalable=0"/>
                    <title>Dranbs / inspire your styles</title>
                </Head>
                <Component {...pageProps} toggleLoaded={this.toggleLoaded} loaded={this.state.loaded}/>
            </Provider>
        )
    }
}

export default MyApp
