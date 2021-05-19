import {
    SET_BOARD_SORT_TYPE,
} from "../actionTypes";

const initialState = {
    sortType: {value: 0, label: 'random'},
}

const boardFilter = (state = initialState, action) => {
    switch (action.type) {
        case SET_BOARD_SORT_TYPE: {
            const sortType = action.payload;
            return {
                ...state,
                sortType
            }
        }
        default:
            return state;
    }
}

export default boardFilter
