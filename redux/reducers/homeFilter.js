import {SET_EXPLORE_TYPE, SET_GENDER, SET_PERIOD, SET_SITE_TYPE} from "../actionTypes";

const initialState = {
    exploreType: false, // true: all, false: my selection
    gender: 0, // 0: all, 1: women, 2: men,
    period: -1, // -1: all, 1: today, 7: one week
    siteType: 1, // 1: new arrivals, 2: sale
}

const homeFilter = (state = initialState, action) => {
    switch (action.type) {
        case SET_EXPLORE_TYPE: {
            const exploreType = action.payload;
            return {
                ...state,
                exploreType
            }
        }
        case SET_GENDER: {
            const gender = action.payload;
            return {
                ...state,
                gender
            }
        }
        case SET_PERIOD: {
            const period = action.payload;
            return {
                ...state,
                period
            }
        }
        case SET_SITE_TYPE: {
            const siteType = action.payload;
            return {
                ...state,
                siteType
            }
        }
        default:
            return state;
    }
}

export default homeFilter
