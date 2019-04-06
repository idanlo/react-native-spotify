import { compose } from 'recompose';
import { connect } from 'react-redux';
import { showModal } from '../modal/ModalState';
import PlaylistScreen from './PlaylistView';

export default compose(
    connect(
        state => ({
            currentTrack: state.player.currentTrack,
        }),
        dispatch => ({
            showModal: (options, actions) =>
                dispatch(showModal(options, actions)),
        }),
    ),
)(PlaylistScreen);
