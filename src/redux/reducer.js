import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import modal from '../modules/modal/ModalState';

export default combineReducers({
    // ## Generator Reducers
    app,
    modal,
});
