import {createStore} from "redux";
import rootReducers from './reducers'
import lscache from "lscache";

// convert object to string and store in localStorage
function saveToLocalStorage(state) {
    try {
        const serialisedState = JSON.stringify(state);
        lscache.set("persistentState", serialisedState);
    } catch (e) {
        console.warn(e);
    }
}

// load string from localStarage and convert back in to an Object
// invalid output must be undefined
function loadFromLocalStorage() {
    try {
        const serialisedState = lscache.get("persistentState");
        if (serialisedState === null) return undefined;
        return JSON.parse(serialisedState);
    } catch (e) {
        console.warn(e);
        return undefined;
    }
}

// create our store from our rootReducers and use loadFromLocalStorage
// to overwrite any values that we already have saved
const store = createStore(rootReducers, loadFromLocalStorage());

// listen for store changes and use saveToLocalStorage to
// save them to localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
