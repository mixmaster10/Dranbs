import {combineReducers} from "redux";
import auth from './auth'
import homeFilter from "./homeFilter";
import brandFilter from "./brandFilter";
import boardModal from "./boardModal";
import boardFilter from "./boardFilter";

export default combineReducers({auth, homeFilter, brandFilter, boardModal, boardFilter})
