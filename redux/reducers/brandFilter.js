import {
    SET_BRAND_GENDER,
    SET_BRAND_PERIOD,
    SET_BRAND_SITE_TYPE,
} from "../actionTypes";

const initialState = {
    gender: 0, // 0: all, 1: women, 2: men,
    period: -1, // -1: all, 1: today, 7: one week
    siteType: 1, // 1: new arrivals, 2: sale
}

const brandFilter = (state = initialState, action) => {
    switch (action.type) {
        case SET_BRAND_GENDER: {
            const gender = action.payload;
            return {
                ...state,
                gender
            }
        }
        case SET_BRAND_PERIOD: {
            const period = action.payload;
            return {
                ...state,
                period
            }
        }
        case SET_BRAND_SITE_TYPE: {
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

export default brandFilter
