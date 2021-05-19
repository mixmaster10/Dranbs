import {
    SET_AUTH, SET_BOARD_SORT_TYPE,
    SET_BRAND_GENDER,
    SET_BRAND_PERIOD,
    SET_BRAND_SITE_TYPE,
    SET_EXPLORE_TYPE,
    SET_GENDER, SET_MODAL_ACTIVE,
    SET_PERIOD, SET_PRODUCT_ID_FOR_BOARD,
    SET_SITE_TYPE
} from "./actionTypes";

export const setAuth = payload => ({
    type: SET_AUTH,
    payload: payload
})

export const setExploreType = payload => ({
    type: SET_EXPLORE_TYPE,
    payload: payload
})

export const setSiteType = payload => ({
    type: SET_SITE_TYPE,
    payload: payload
})

export const setGender = payload => ({
    type: SET_GENDER,
    payload: payload
})

export const setPeriod = payload => ({
    type: SET_PERIOD,
    payload: payload
})

export const setBrandSiteType = payload => ({
    type: SET_BRAND_SITE_TYPE,
    payload: payload
})

export const setBrandGender = payload => ({
    type: SET_BRAND_GENDER,
    payload: payload
})

export const setBrandPeriod = payload => ({
    type: SET_BRAND_PERIOD,
    payload: payload
})

export const setModalActive = payload => ({
    type: SET_MODAL_ACTIVE,
    payload: payload
})

export const setProductIdForBoard = payload => ({
    type: SET_PRODUCT_ID_FOR_BOARD,
    payload: payload
})

export const setBoardSortType = payload => ({
    type: SET_BOARD_SORT_TYPE,
    payload: payload
})