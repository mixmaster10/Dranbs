import {SET_AUTH} from "../actionTypes";

const initialState = {
    auth: false
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH: {
            const auth = action.payload;
            return {
                ...state,
                auth
            }
        }
        default:
            return state;
    }
}

export default auth
