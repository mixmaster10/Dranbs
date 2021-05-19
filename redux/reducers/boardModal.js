import {SET_MODAL_ACTIVE, SET_PRODUCT_ID_FOR_BOARD} from "../actionTypes";

const initialState = {
    isActive: false, // false: all, true: my selection
    productId: -1
}

const boardModal = (state = initialState, action) => {
    switch (action.type) {
        case SET_MODAL_ACTIVE: {
            const isActive = action.payload;
            return {
                ...state,
                isActive
            }
        }
        case SET_PRODUCT_ID_FOR_BOARD: {
            const productId = action.payload;
            return {
                ...state,
                productId
            }
        }
        default:
            return state;
    }
}

export default boardModal
