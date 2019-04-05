import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import modal from '../modules/modal/ModalState';
import player from '../modules/player/PlayerState';

export default combineReducers({
    // ## Generator Reducers
    app,
    modal,
    player,
});
